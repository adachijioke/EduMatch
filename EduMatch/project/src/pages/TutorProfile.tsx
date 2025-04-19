import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Calendar, Clock, Award, BookOpen, MessageSquare, Video, Wallet, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data
const tutors = [
  {
    id: '1',
    name: 'Dr. Michael Chen',
    subjects: ['Mathematics', 'Physics'],
    rating: 4.9,
    hourlyRate: 45,
    bio: 'PhD in Applied Mathematics with 10+ years of teaching experience. I specialize in calculus, linear algebra, differential equations, and theoretical physics. My teaching approach focuses on building intuition and deep understanding rather than memorization.',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    availability: 'Weekdays evenings, Weekends',
    totalSessions: 247,
    education: [
      { degree: 'PhD in Applied Mathematics', institution: 'MIT', year: '2015' },
      { degree: 'MS in Mathematics', institution: 'Stanford University', year: '2011' },
      { degree: 'BS in Mathematics', institution: 'UC Berkeley', year: '2009' },
    ],
    experience: [
      { position: 'Associate Professor', company: 'University of Washington', period: '2018 - Present' },
      { position: 'Research Scientist', company: 'Tech Research Labs', period: '2015 - 2018' },
      { position: 'Teaching Assistant', company: 'MIT', period: '2011 - 2015' },
    ],
    reviews: [
      {
        id: '1',
        student: 'Alex Johnson',
        rating: 5,
        date: 'June 15, 2023',
        comment: 'Dr. Chen is an exceptional tutor. He explained complex calculus concepts in a way that finally made sense to me. Highly recommended!',
        studentImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      },
      {
        id: '2',
        student: 'Jessica Lee',
        rating: 5,
        date: 'May 22, 2023',
        comment: 'I was struggling with differential equations until I started sessions with Dr. Chen. His teaching method is clear and effective. My grades have improved significantly.',
        studentImage: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
      },
      {
        id: '3',
        student: 'David Kim',
        rating: 4,
        date: 'April 10, 2023',
        comment: 'Great tutor with in-depth knowledge of physics. Very patient and willing to explain concepts multiple times if needed.',
        studentImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      },
    ],
    badges: ['Top Rated', 'Physics Expert', 'Quick Responder'],
  },
];

const TutorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const tutor = tutors.find(t => t.id === id);
  
  if (!tutor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tutor Not Found</h2>
        <p className="text-gray-600 mb-6">The tutor you're looking for doesn't exist or has been removed.</p>
        <Link to="/tutors" className="btn btn-primary">
          Back to Tutors
        </Link>
      </div>
    );
  }
  
  // Available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });
  
  // Available time slots
  const availableTimeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  ];
  
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-lg font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/tutors" className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
          <ChevronUp className="h-4 w-4 rotate-270 mr-1" /> Back to tutors
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Tutor info */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <img 
                src={tutor.profileImage} 
                alt={tutor.name} 
                className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {tutor.subjects.map((subject) => (
                    <span 
                      key={subject} 
                      className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                {renderRatingStars(tutor.rating)}
                <p className="text-gray-600 mt-1">{tutor.totalSessions} sessions completed</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {tutor.badges.map((badge) => (
                <div 
                  key={badge} 
                  className="flex items-center bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm"
                >
                  <Award className="h-4 w-4 mr-1" />
                  {badge}
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About Me</h2>
              <p className="text-gray-700 mb-4">{tutor.bio}</p>
              
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">Availability: {tutor.availability}</span>
              </div>
              
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">Rate: <span className="font-semibold text-primary-600">${tutor.hourlyRate}</span>/hour</span>
              </div>
            </div>
          </div>
          
          {/* Education */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
            <ul className="space-y-4">
              {tutor.education.map((edu, index) => (
                <li key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Experience */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
            <ul className="space-y-4">
              {tutor.experience.map((exp, index) => (
                <li key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-accent-100 flex items-center justify-center">
                      <svg className="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.period}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
              <div className="flex items-center">
                {renderRatingStars(tutor.rating)}
                <span className="ml-2 text-gray-600">({tutor.reviews.length})</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {(showAllReviews ? tutor.reviews : tutor.reviews.slice(0, 2)).map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start">
                    <img 
                      src={review.studentImage} 
                      alt={review.student} 
                      className="h-10 w-10 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{review.student}</h3>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="mt-3 text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {tutor.reviews.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center mx-auto"
                >
                  {showAllReviews ? (
                    <>Show less <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>View all reviews <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column: Booking */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book a Session</h2>
            
            <div className="mb-6">
              <label className="label">Select a Date</label>
              <div className="grid grid-cols-3 gap-2">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    className={`p-2 text-sm rounded-md border ${
                      selectedDate === date
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 hover:border-primary-400'
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
            
            {selectedDate && (
              <div className="mb-6">
                <label className="label">Select a Time</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      className={`p-2 text-sm rounded-md border ${
                        selectedTime === time
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:border-primary-400'
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="label">Duration</label>
              <select className="input">
                <option>30 minutes - ${(tutor.hourlyRate / 2).toFixed(2)}</option>
                <option>60 minutes - ${tutor.hourlyRate.toFixed(2)}</option>
                <option>90 minutes - ${(tutor.hourlyRate * 1.5).toFixed(2)}</option>
                <option>120 minutes - ${(tutor.hourlyRate * 2).toFixed(2)}</option>
              </select>
            </div>
            
            <div className="border-t border-gray-200 py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Session Price</span>
                <span className="font-medium">${tutor.hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Platform Fee</span>
                <span className="font-medium">${(tutor.hourlyRate * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-3">
                <span>Total</span>
                <span className="text-primary-600">${(tutor.hourlyRate * 1.05).toFixed(2)}</span>
              </div>
            </div>
            
            <button
              className={`w-full btn py-3 mb-4 ${
                selectedDate && selectedTime
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!selectedDate || !selectedTime}
            >
              Book Now
            </button>
            
            <div className="flex space-x-2">
              <button className="flex-1 btn btn-outline py-2 flex justify-center items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Message
              </button>
              <button className="flex-1 btn btn-outline py-2 flex justify-center items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;