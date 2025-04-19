import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWeb3 } from './Web3Context';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  reputation: number;
  tokens: number;
  profileImageUrl?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'student' | 'tutor') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();

  // Simulate fetching the user data from backend/localStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // In a real app, fetch user data based on wallet or JWT
        const storedUser = localStorage.getItem('eduMatchUser');
        
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [account]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // In real app, authenticate with backend
      // This is just a mock for demonstration
      const mockUser: User = {
        id: '123456',
        name: 'John Doe',
        email: email,
        role: 'student',
        reputation: 4.5,
        tokens: 100,
        profileImageUrl: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg',
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('eduMatchUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'tutor') => {
    try {
      setLoading(true);
      
      // In real app, register with backend
      // This is just a mock for demonstration
      const mockUser: User = {
        id: '654321',
        name: name,
        email: email,
        role: role,
        reputation: 0,
        tokens: 50,
        profileImageUrl: undefined,
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('eduMatchUser', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('eduMatchUser');
  };

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};