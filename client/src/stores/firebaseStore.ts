import { create } from 'zustand';
import { auth, db } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  Timestamp 
} from 'firebase/firestore';

interface FirebaseStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

type SetState = (fn: (state: FirebaseStore) => Partial<FirebaseStore>) => void;

export const useFirebaseStore = create<FirebaseStore>((set: SetState) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set((state) => ({ ...state, user: userCredential.user, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to login', loading: false }));
    }
  },

  logout: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      await signOut(auth);
      set((state) => ({ ...state, user: null, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to logout', loading: false }));
    }
  },

  initializeAuth: () => {
    auth.onAuthStateChanged((user: User | null) => {
      set((state) => ({ ...state, user }));
    });
  },
})); 