import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, BookOpen, Clock } from 'lucide-react';

// Mock data
const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 
  'English', 'History', 'Geography', 'Economics', 'Business', 'Art',
  'Music', 'Physical Education', 'Foreign Languages', 'Medicine'
];

interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  hourlyRate: number;
  bio: string;
  profileImage: string;
  availability: string;
  totalSessions: number;
}

const tutors: Tutor[] = [
  {
    id: '1',
    name: 'Dr. Michael Chen',
    subjects: ['Mathematics', 'Physics'],
    rating: 4.9,
    hourlyRate: 45,
    bio: 'PhD in Applied Mathematics with 10+ years of teaching experience.',
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    availability: 'Weekdays evenings, Weekends',
    totalSessions: 247,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    subjects: ['Computer Science', 'Mathematics'],
    rating: 4.8,
    hourlyRate: 40,
    bio: 'Software Engineer with expertise in algorithms and data structures.',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    availability: 'Weekends, Monday evenings',
    totalSessions: 189,
  },
  {
    id: '3',
    name: 'James Wilson',
    subjects: ['Physics', 'Chemistry'],
    rating: 4.7,
    hourlyRate: 35,
    bio: 'Physics teacher with a passion for making complex concepts simple.',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    availability: 'Weekday mornings and afternoons',
    totalSessions: 156,
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    subjects: ['English', 'History'],
    rating: 4.9,
    hourlyRate: 38,
    bio: 'English Literature graduate with a focus on essay writing and critical analysis.',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    availability: 'Flexible schedule',
    totalSessions: 203,
  },
  {
    id: '5',
    name: 'David Kim',
    subjects: ['Economics', 'Business'],
    rating: 4.6,
    hourlyRate: 42,
    bio: 'MBA graduate with real-world business experience to share.',
    profileImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    availability: 'Weekday evenings, Saturdays',
    totalSessions: 134,
  },
  {
    id: '6',
    name: 'Lisa Patel',
    subjects: ['Biology', 'Chemistry'],
    rating: 4.8,
    hourlyRate: 39,
    bio: 'Medical student passionate about teaching life sciences.',
    profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    availability: 'Sundays, Tuesday and Thursday evenings',
    totalSessions: 178,
  },
];

const TutorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxRate, setMaxRate] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredTutors = tutors.filter(tutor => {
    // Search term filter
    const nameMatch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = tutor.subjects.some(subject => 
      subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const searchMatch = nameMatch || subjectMatch;
    
    // Subject filter
    const subjectFilterMatch = selectedSubject 
      ? tutor.subjects.includes(selectedSubject)
      : true;
    
    // Rating filter
    const ratingMatch = minRating 
      ? tutor.rating >= minRating
      : true;
    
    // Price filter
    const priceMatch = maxRate
      ? tutor.hourlyRate <= maxRate
      : true;
    
    return searchMatch && subjectFilterMatch && ratingMatch && priceMatch;
  });
  
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find the Perfect Tutor</h1>
        <p className="text-gray-600 mt-1">
          Browse our community of expert tutors matched to your learning needs
        </p>
      </div>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or subject..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center justify-center md:w-auto"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="label">Subject</label>
              <select
                className="input"
                value={selectedSubject || ''}
                onChange={(e) => setSelectedSubject(e.target.value || null)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="label">Minimum Rating</label>
              <select
                className="input"
                value={minRating || ''}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+</option>
                <option value="4">4+</option>
                <option value="3.5">3.5+</option>
                <option value="3">3+</option>
              </select>
            </div>
            
            <div>
              <label className="label">Maximum Rate ($/hour)</label>
              <select
                className="input"
                value={maxRate || ''}
                onChange={(e) => setMaxRate(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Any Price</option>
                <option value="25">Up to $25</option>
                <option value="35">Up to $35</option>
                <option value="50">Up to $50</option>
                <option value="75">Up to $75</option>
                <option value="100">Up to $100</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Tutors list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor) => (
            <div key={tutor.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={tutor.profileImage}
                      alt={tutor.name}
                      className="h-16 w-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                      {renderRatingStars(tutor.rating)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-lg text-primary-600">${tutor.hourlyRate}</span>
                    <span className="text-gray-600 text-sm">/hr</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      {tutor.subjects.join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{tutor.availability}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tutor.bio}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{tutor.totalSessions} sessions completed</span>
                  <Link to={`/tutors/${tutor.id}`} className="btn btn-primary">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search term to find more tutors.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSubject(null);
                setMinRating(null);
                setMaxRate(null);
              }}
              className="btn btn-outline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorList;