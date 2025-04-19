import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen, Wallet, Award, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Mock data
  const upcomingSessions = [
    {
      id: '1',
      subject: 'Advanced Mathematics',
      tutor: 'Dr. Michael Chen',
      date: 'Tomorrow',
      time: '3:00 PM - 4:00 PM',
      tutorImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    {
      id: '2',
      subject: 'Programming Fundamentals',
      tutor: 'Sarah Johnson',
      date: 'Friday, June 24',
      time: '5:30 PM - 6:30 PM',
      tutorImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
  ];
  
  const recentSessions = [
    {
      id: '3',
      subject: 'Physics 101',
      tutor: 'James Wilson',
      date: 'Monday, June 20',
      duration: '60 min',
      rating: 5,
      tutorImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    },
    {
      id: '4',
      subject: 'Chemistry Basics',
      tutor: 'Emma Rodriguez',
      date: 'Saturday, June 18',
      duration: '45 min',
      rating: 4,
      tutorImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
  ];
  
  const renderRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {currentUser?.name}!
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-start space-x-4">
          <div className="p-3 rounded-full bg-primary-100 text-primary-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Hours</p>
            <p className="text-2xl font-semibold text-gray-900">12.5</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-start space-x-4">
          <div className="p-3 rounded-full bg-accent-100 text-accent-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tutors Connected</p>
            <p className="text-2xl font-semibold text-gray-900">5</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-start space-x-4">
          <div className="p-3 rounded-full bg-success-100 text-success-600">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tokens Earned</p>
            <p className="text-2xl font-semibold text-gray-900">{currentUser?.tokens || 0}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 flex items-start space-x-4">
          <div className="p-3 rounded-full bg-warning-100 text-warning-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Reputation Score</p>
            <p className="text-2xl font-semibold text-gray-900">{currentUser?.reputation || 0}</p>
          </div>
        </div>
      </div>
      
      {/* Upcoming Sessions */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          <Link to="/tutors" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Find more tutors
          </Link>
        </div>
        
        {upcomingSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{session.subject}</h3>
                      <div className="flex items-center mt-2">
                        <img
                          src={session.tutorImage}
                          alt={session.tutor}
                          className="h-8 w-8 rounded-full object-cover mr-2"
                        />
                        <span className="text-gray-600">{session.tutor}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{session.date}</span>
                      <p className="text-sm text-gray-600 mt-1">{session.time}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Join 5 minutes before</span>
                    </div>
                    <Link 
                      to={`/session/${session.id}`}
                      className="btn btn-primary py-2"
                    >
                      Join Session
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
            <p className="text-gray-600 mb-6">
              You don't have any scheduled tutoring sessions yet.
            </p>
            <Link to="/tutors" className="btn btn-primary">
              Find a Tutor
            </Link>
          </div>
        )}
      </div>
      
      {/* Recent Sessions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Sessions</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </button>
        </div>
        
        {recentSessions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {recentSessions.map((session) => (
                <li key={session.id} className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <img
                        src={session.tutorImage}
                        alt={session.tutor}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{session.subject}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-600 mr-2">{session.tutor}</span>
                          <span className="text-xs text-gray-500">({session.duration})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex">{renderRatingStars(session.rating)}</div>
                      <p className="text-xs text-gray-500 mt-1">{session.date}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No past sessions</h3>
            <p className="text-gray-600">
              Once you complete a tutoring session, it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;