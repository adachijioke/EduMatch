// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EduMatch
 * @dev Smart contract for the EduMatch decentralized tutoring platform
 */
contract EduMatch {
    // Contract owner
    address public owner;
    
    // Token details
    string public constant name = "EduMatch Token";
    string public constant symbol = "EDU";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;
    
    // User roles
    enum Role { Student, Tutor }
    
    // User struct
    struct User {
        address userAddress;
        string name;
        string email;
        Role role;
        uint256 reputation;
        uint256 tokenBalance;
        bool exists;
    }
    
    // Session struct
    struct Session {
        uint256 id;
        address tutor;
        address student;
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        bool completed;
        bool canceled;
        bool reviewed;
    }
    
    // Review struct
    struct Review {
        uint256 sessionId;
        address reviewer;
        address reviewee;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }
    
    // Mappings
    mapping(address => User) public users;
    mapping(uint256 => Session) public sessions;
    mapping(uint256 => Review) public reviews;
    mapping(address => mapping(address => uint256)) private allowances;
    
    // Arrays to keep track of entities
    address[] public tutors;
    uint256[] public activeSessionIds;
    uint256 public sessionCounter;
    uint256 public reviewCounter;
    
    // Events
    event UserRegistered(address indexed userAddress, string name, Role role);
    event SessionCreated(uint256 indexed sessionId, address indexed tutor, address indexed student, uint256 amount, uint256 startTime, uint256 duration);
    event SessionCompleted(uint256 indexed sessionId);
    event SessionCanceled(uint256 indexed sessionId);
    event ReviewSubmitted(uint256 indexed sessionId, address indexed reviewer, address indexed reviewee, uint256 rating);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].exists, "User is not registered");
        _;
    }
    
    modifier onlyTutor() {
        require(users[msg.sender].exists && users[msg.sender].role == Role.Tutor, "Only tutors can call this function");
        _;
    }
    
    modifier onlyStudent() {
        require(users[msg.sender].exists && users[msg.sender].role == Role.Student, "Only students can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        totalSupply = 1000000 * 10**uint256(decimals); // 1 million tokens
        users[owner].tokenBalance = totalSupply;
        
        // Register owner as admin user
        users[owner] = User({
            userAddress: owner,
            name: "Admin",
            email: "admin@edumatch.com",
            role: Role.Tutor,
            reputation: 5,
            tokenBalance: totalSupply,
            exists: true
        });
        
        emit UserRegistered(owner, "Admin", Role.Tutor);
    }
    
    /**
     * @dev Register a new user
     * @param _name Name of the user
     * @param _email Email of the user
     * @param _role Role of the user (0 for Student, 1 for Tutor)
     */
    function registerUser(string memory _name, string memory _email, Role _role) public {
        require(!users[msg.sender].exists, "User already registered");
        
        users[msg.sender] = User({
            userAddress: msg.sender,
            name: _name,
            email: _email,
            role: _role,
            reputation: 0,
            tokenBalance: 0,
            exists: true
        });
        
        // If registering as a tutor, add to tutors array
        if (_role == Role.Tutor) {
            tutors.push(msg.sender);
        }
        
        // Give new users some tokens to start
        uint256 startTokens = 50 * 10**uint256(decimals);
        transferFrom(owner, msg.sender, startTokens);
        
        emit UserRegistered(msg.sender, _name, _role);
    }
    
    /**
     * @dev Update user profile
     * @param _name New name
     * @param _email New email
     */
    function updateProfile(string memory _name, string memory _email) public onlyRegistered {
        User storage user = users[msg.sender];
        user.name = _name;
        user.email = _email;
    }
    
    /**
     * @dev Create a new tutoring session
     * @param _tutor Address of the tutor
     * @param _amount Amount of tokens to be paid for the session
     * @param _startTime Unix timestamp when the session starts
     * @param _duration Duration of the session in minutes
     * @return sessionId The ID of the created session
     */
    function createSession(address _tutor, uint256 _amount, uint256 _startTime, uint256 _duration) 
        public 
        onlyStudent 
        returns (uint256) 
    {
        require(users[_tutor].exists && users[_tutor].role == Role.Tutor, "Invalid tutor address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_duration > 0, "Duration must be greater than 0");
        require(users[msg.sender].tokenBalance >= _amount, "Insufficient token balance");
        
        // Transfer tokens to contract (escrow)
        transfer(address(this), _amount);
        
        uint256 sessionId = sessionCounter++;
        sessions[sessionId] = Session({
            id: sessionId,
            tutor: _tutor,
            student: msg.sender,
            amount: _amount,
            startTime: _startTime,
            duration: _duration,
            completed: false,
            canceled: false,
            reviewed: false
        });
        
        activeSessionIds.push(sessionId);
        
        emit SessionCreated(sessionId, _tutor, msg.sender, _amount, _startTime, _duration);
        
        return sessionId;
    }
    
    /**
     * @dev Complete a session and release payment to tutor
     * @param _sessionId ID of the session to complete
     */
    function completeSession(uint256 _sessionId) public {
        Session storage session = sessions[_sessionId];
        
        // Session can be marked as completed by either the student or the contract owner (admin)
        require(
            msg.sender == session.student || msg.sender == owner,
            "Only the student or admin can complete the session"
        );
        require(!session.completed && !session.canceled, "Session already completed or canceled");
        
        // Mark session as completed
        session.completed = true;
        
        // Transfer tokens from contract (escrow) to tutor
        users[session.tutor].tokenBalance += session.amount;
        users[address(this)].tokenBalance -= session.amount;
        
        // Award bonus tokens to tutor (5% of session amount)
        uint256 bonus = session.amount * 5 / 100;
        transferFrom(owner, session.tutor, bonus);
        
        // Remove from active sessions
        removeActiveSession(_sessionId);
        
        emit SessionCompleted(_sessionId);
    }
    
    /**
     * @dev Cancel a session and refund the student
     * @param _sessionId ID of the session to cancel
     */
    function cancelSession(uint256 _sessionId) public {
        Session storage session = sessions[_sessionId];
        
        // Session can be canceled by the student, tutor, or admin
        require(
            msg.sender == session.student || 
            msg.sender == session.tutor || 
            msg.sender == owner,
            "Only the student, tutor, or admin can cancel the session"
        );
        require(!session.completed && !session.canceled, "Session already completed or canceled");
        
        // Mark session as canceled
        session.canceled = true;
        
        // Refund tokens to student from contract (escrow)
        users[session.student].tokenBalance += session.amount;
        users[address(this)].tokenBalance -= session.amount;
        
        // Remove from active sessions
        removeActiveSession(_sessionId);
        
        emit SessionCanceled(_sessionId);
    }
    
    /**
     * @dev Submit a review for a completed session
     * @param _sessionId ID of the session
     * @param _rating Rating from 1 to 5
     * @param _comment Review comment
     */
    function submitReview(uint256 _sessionId, uint256 _rating, string memory _comment) 
        public 
        onlyStudent 
    {
        Session storage session = sessions[_sessionId];
        
        require(session.completed, "Session must be completed to leave a review");
        require(!session.reviewed, "Review already submitted for this session");
        require(msg.sender == session.student, "Only the student can submit a review");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        // Mark session as reviewed
        session.reviewed = true;
        
        // Create review
        uint256 reviewId = reviewCounter++;
        reviews[reviewId] = Review({
            sessionId: _sessionId,
            reviewer: msg.sender,
            reviewee: session.tutor,
            rating: _rating,
            comment: _comment,
            timestamp: block.timestamp
        });
        
        // Update tutor's reputation
        updateReputation(session.tutor, _rating);
        
        // Award tokens to student for leaving a review
        uint256 reviewBonus = 5 * 10**uint256(decimals);
        transferFrom(owner, msg.sender, reviewBonus);
        
        emit ReviewSubmitted(_sessionId, msg.sender, session.tutor, _rating);
    }
    
    /**
     * @dev Update the reputation of a user based on a new rating
     * @param _user Address of the user
     * @param _newRating New rating received
     */
    function updateReputation(address _user, uint256 _newRating) internal {
        User storage user = users[_user];
        
        // Simple average calculation (can be improved with weighted average)
        if (user.reputation == 0) {
            user.reputation = _newRating;
        } else {
            user.reputation = (user.reputation + _newRating) / 2;
        }
    }
    
    /**
     * @dev Remove a session from the active sessions array
     * @param _sessionId ID of the session to remove
     */
    function removeActiveSession(uint256 _sessionId) internal {
        for (uint256 i = 0; i < activeSessionIds.length; i++) {
            if (activeSessionIds[i] == _sessionId) {
                // Replace with the last element and pop
                activeSessionIds[i] = activeSessionIds[activeSessionIds.length - 1];
                activeSessionIds.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Get the number of tutors registered on the platform
     * @return The number of tutors
     */
    function getTutorCount() public view returns (uint256) {
        return tutors.length;
    }
    
    /**
     * @dev Get the details of a tutor by index
     * @param _index Index of the tutor in the tutors array
     * @return The tutor's address
     */
    function getTutorByIndex(uint256 _index) public view returns (address) {
        require(_index < tutors.length, "Index out of bounds");
        return tutors[_index];
    }
    
    /**
     * @dev Get the number of active sessions
     * @return The number of active sessions
     */
    function getActiveSessionCount() public view returns (uint256) {
        return activeSessionIds.length;
    }
    
    /**
     * @dev Get the ID of an active session by index
     * @param _index Index of the session in the active sessions array
     * @return The session ID
     */
    function getActiveSessionByIndex(uint256 _index) public view returns (uint256) {
        require(_index < activeSessionIds.length, "Index out of bounds");
        return activeSessionIds[_index];
    }
    
    /**
     * @dev Get all sessions for a specific user (either as student or tutor)
     * @param _user Address of the user
     * @return Array of session IDs
     */
    function getUserSessions(address _user) public view returns (uint256[] memory) {
        // First, count the sessions for this user
        uint256 count = 0;
        for (uint256 i = 0; i < sessionCounter; i++) {
            if (sessions[i].student == _user || sessions[i].tutor == _user) {
                count++;
            }
        }
        
        // Create and populate the array
        uint256[] memory userSessions = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < sessionCounter; i++) {
            if (sessions[i].student == _user || sessions[i].tutor == _user) {
                userSessions[index] = i;
                index++;
            }
        }
        
        return userSessions;
    }
    
    /**
     * @dev Get the balance of a user
     * @param _owner Address of the user
     * @return The token balance
     */
    function balanceOf(address _owner) public view returns (uint256) {
        return users[_owner].tokenBalance;
    }
    
    /**
     * @dev Transfer tokens to another address
     * @param _to Address to transfer to
     * @param _value Amount to transfer
     * @return Success status
     */
    function transfer(address _to, uint256 _value) public onlyRegistered returns (bool) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(users[msg.sender].tokenBalance >= _value, "Insufficient balance");
        
        users[msg.sender].tokenBalance -= _value;
        users[_to].tokenBalance += _value;
        
        emit TokensTransferred(msg.sender, _to, _value);
        return true;
    }
    
    /**
     * @dev Approve another address to spend tokens on your behalf
     * @param _spender Address to approve
     * @param _value Amount to approve
     * @return Success status
     */
    function approve(address _spender, uint256 _value) public onlyRegistered returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    /**
     * @dev Get the amount of tokens approved for a spender
     * @param _owner Address of the token owner
     * @param _spender Address of the spender
     * @return The approved amount
     */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }
    
    /**
     * @dev Transfer tokens from one address to another
     * @param _from Address to transfer from
     * @param _to Address to transfer to
     * @param _value Amount to transfer
     * @return Success status
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_to != address(0), "Cannot transfer to zero address");
        require(users[_from].tokenBalance >= _value, "Insufficient balance");
        
        if (_from != msg.sender && _from != owner) {
            require(allowances[_from][msg.sender] >= _value, "Allowance exceeded");
            allowances[_from][msg.sender] -= _value;
        }
        
        users[_from].tokenBalance -= _value;
        users[_to].tokenBalance += _value;
        
        emit TokensTransferred(_from, _to, _value);
        return true;
    }
    
    /**
     * @dev Mint new tokens (only owner)
     * @param _amount Amount of tokens to mint
     */
    function mint(uint256 _amount) public onlyOwner {
        totalSupply += _amount;
        users[owner].tokenBalance += _amount;
    }
    
    /**
     * @dev Burn tokens (only owner)
     * @param _amount Amount of tokens to burn
     */
    function burn(uint256 _amount) public onlyOwner {
        require(users[owner].tokenBalance >= _amount, "Insufficient balance");
        totalSupply -= _amount;
        users[owner].tokenBalance -= _amount;
    }
}