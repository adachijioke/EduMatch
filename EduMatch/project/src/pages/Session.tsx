import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Mic, MicOff, Video, VideoOff, Share, Send, Phone } from 'lucide-react';

// Mock data for the session
const sessionData = {
  id: '1',
  subject: 'Advanced Mathematics',
  tutor: {
    name: 'Dr. Michael Chen',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  },
  student: {
    name: 'John Doe',
    profileImage: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg',
  },
  duration: 60, // minutes
  startTime: new Date().toISOString(),
};

const Session: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'tutor', text: 'Hello! Welcome to our session on Advanced Mathematics.', time: '3:02 PM' },
    { sender: 'student', text: 'Thanks! I have some questions about calculus.', time: '3:03 PM' },
  ]);
  const [timeRemaining, setTimeRemaining] = useState('59:59');
  
  // Timer effect for session countdown
  useEffect(() => {
    const startTime = new Date(sessionData.startTime).getTime();
    const endTime = startTime + sessionData.duration * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance <= 0) {
        clearInterval(interval);
        setTimeRemaining('00:00');
        return;
      }
      
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      setTimeRemaining(
        `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [sessionData.startTime, sessionData.duration]);
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };
  
  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
  };
  
  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };
  
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      sender: 'student',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-4">
            <h1 className="font-semibold">{sessionData.subject}</h1>
            <div className="flex items-center text-sm text-gray-300">
              <span className="mr-2">with {sessionData.tutor.name}</span>
              <span className="bg-green-500 rounded-full h-2 w-2 mr-1"></span>
              <span>Live</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-3 py-1 bg-primary-700 rounded-full text-sm font-medium flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {timeRemaining}
          </div>
          <button className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
            <Phone className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex">
        {/* Video area */}
        <div className="flex-grow bg-gray-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {isVideoOn ? (
              <img 
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg" 
                alt="Video stream" 
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="bg-gray-800 h-full w-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-semibold text-white">
                      {sessionData.tutor.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-white text-lg">{sessionData.tutor.name}</p>
                  <p className="text-gray-400">Camera is off</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Self video (picture-in-picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-gray-700">
            <img 
              src={sessionData.student.profileImage} 
              alt="Self view" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </div>
          </div>
        </div>
        
        {/* Chat panel */}
        {isChatOpen && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <h2 className="text-white font-medium">Chat</h2>
            </div>
            
            <div className="flex-grow p-3 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.sender === 'student' ? 'text-right' : 'text-left'}`}>
                  <div className="inline-block">
                    <div className={`px-3 py-2 rounded-lg max-w-xs inline-block ${
                      msg.sender === 'student' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-700 text-white'
                    }`}>
                      {msg.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 border-t border-gray-700">
              <form onSubmit={sendMessage} className="flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow bg-gray-700 border-0 rounded-l-md text-white p-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 rounded-r-md px-3 text-white"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="bg-gray-800 text-white px-4 py-3 flex justify-center">
        <div className="flex space-x-4">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full ${isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <Share className="h-5 w-5" />
          </button>
          <button
            onClick={toggleChat}
            className={`p-3 rounded-full ${isChatOpen ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Session;