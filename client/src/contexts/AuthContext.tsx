import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

export interface User {
  id: number;
  email: string;
  is_superuser: boolean;
  is_active: boolean;
  verified: boolean;
  theme: string;
  user_uid: string;
  created_at: string;
  updated_at: string;
  addresses?: {
    id: number;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
  }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await api.get<User>('/users/me');
          if (!response.data.is_active) {
            await firebaseSignOut(auth);
            throw new Error('Ваш аккаунт заблокирован');
          }
          setUser(response.data);
          
          if (response.data.is_superuser) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error syncing with backend:', error);
          await firebaseSignOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (loading) return;
    try {
      setLoading(true);
      // Only handle Firebase authentication here
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle the rest
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Create user in our backend with the Firebase UID
        await api.post('/users/', {
          email: email,
          password: password,
          user_uid: userCredential.user.uid,
          theme: 'light' // Default theme
        });
      }
      
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.is_superuser || false,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 