import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const ADMIN_EMAIL = 'laughugin@icloud.com';

export const isAdmin = (email: string | null): boolean => {
  return email === ADMIN_EMAIL;
};

export const adminLogin = async (email: string, password: string): Promise<void> => {
  if (email !== ADMIN_EMAIL) {
    throw new Error('Access denied');
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

export const adminLogout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}; 