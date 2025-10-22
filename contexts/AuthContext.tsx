import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
 signInWithEmailAndPassword,      
 onAuthStateChanged, 
 createUserWithEmailAndPassword, 
 updateProfile, 
 User as FirebaseUser } 
 from 'firebase/auth';
import { auth } from '../firebase';
import { api } from '../services/api';
import type { User } from '../types';

// This is the mock user we'll use for the demo login.
const MOCK_USER: User = { 
  id: 'mock-user-firebase-uid-123', // Using a string ID as per the new type
  fullName: 'Aarav Patel', 
  avatarUrl: 'https://picsum.photos/seed/user1/100/100' 
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (newDetails: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Listen for Firebase auth state changes
  useEffect(() => {
    // Check if Firebase auth is available
    if (!auth) {
      setFirebaseError('Firebase Authentication is not properly configured');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Get the ID token and store it
          try {
            const token = await firebaseUser.getIdToken();
            console.log('Firebase ID token obtained:', token.substring(0, 50) + '...');
            localStorage.setItem('authToken', token);
            console.log('Token stored in localStorage');
            
            // Sync user with backend on every auth state change
            try {
              const backendUser = await api.syncFirebaseUser(token);
              console.log('User synced with backend:', backendUser);
              
              // Use backend user data if available, fallback to Firebase data
              const userData: User = {
                id: backendUser.id || firebaseUser.uid,
                fullName: backendUser.fullName || firebaseUser.displayName || 'User',
                avatarUrl: backendUser.avatarUrl || firebaseUser.photoURL || 'https://picsum.photos/seed/user1/100/100'
              };
              setUser(userData);
            } catch (syncError) {
              console.error('Failed to sync user with backend:', syncError);
              
              // Fallback to Firebase user data only
              const userData: User = {
                id: firebaseUser.uid,
                fullName: firebaseUser.displayName || 'User',
                avatarUrl: firebaseUser.photoURL || 'https://picsum.photos/seed/user1/100/100'
              };
              setUser(userData);
            }
          } catch (error) {
            console.error('Error getting ID token:', error);
          }
        } else {
          setUser(null);
          localStorage.removeItem('authToken');
        }
        setFirebaseError(null);
      } catch (error) {
        console.error('Firebase auth state change error:', error);
        setFirebaseError('Authentication service unavailable');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Authentication is not properly configured. Please check your Firebase setup.');
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle setting the user
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/configuration-not-found') {
        throw new Error('Authentication is not enabled. Please enable Email/Password authentication in Firebase Console.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    if (!auth) {
      throw new Error('Firebase Authentication is not properly configured. Please check your Firebase setup.');
    }
    
    try {
      // Step 1: Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Step 2: Update the user's display name in Firebase
      await updateProfile(userCredential.user, {
        displayName: fullName
      });

      // Step 3: Get the Firebase ID token
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('authToken', token);

      // Step 4: Sync user with backend database
      try {
        await api.syncFirebaseUser(token);
        console.log('User successfully synced with backend');
      } catch (backendError: any) {
        console.error('Failed to sync user with backend:', backendError);
        console.warn('Continuing with Firebase user only. Backend sync failed.');
        // Don't throw error - allow signup to continue with Firebase only
      }
      
      // The onAuthStateChanged listener will handle setting the user state
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/configuration-not-found') {
        throw new Error('Authentication is not enabled. Please enable Email/Password authentication in Firebase Console.');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password authentication is not enabled.');
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle clearing the user
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateUser = (newDetails: Partial<User>) => {
    // This is a local update for now. A real implementation would
    // call a backend endpoint to save the changes.
    setUser(prevUser => {
        if (!prevUser) return null;
        return { ...prevUser, ...newDetails };
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, updateUser, loading }}>
      {!loading && children}
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
