import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCh2l4fzyf7CSxtkcMuhIPnuScKJUz7dOI",
  authDomain: "shoptracker-fc62f.firebaseapp.com",
  projectId: "shoptracker-fc62f",
  storageBucket: "shoptracker-fc62f.firebasestorage.app",
  messagingSenderId: "967252844439",
  appId: "1:967252844439:web:85eb038f4972f935972ed2",
  measurementId: "G-8GVYLJ33J2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }; 