import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
// You'll need to replace these with your actual Firebase project config

const firebaseConfig = {
    apiKey: "AIzaSyCUB1gY42TDVEK0RnZQlqmZuwXZ5ja-ApQ",
    authDomain: "gmgb-bc25b.firebaseapp.com",
    projectId: "gmgb-bc25b",
    storageBucket: "gmgb-bc25b.firebasestorage.app",
    messagingSenderId: "146074250821",
    appId: "1:146074250821:web:376aac3dc17294ad1f3d2c",
    measurementId: "G-S9PW1WZM7P"
  };

// Initialize Firebase
let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth };
export default app;
