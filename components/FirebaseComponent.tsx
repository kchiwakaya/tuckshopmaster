import React, { useEffect, useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../firebaseConfig'; // Import the initialized app
import { getFirestore } from 'firebase/firestore'; // Import Firestore functions

const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

const FirebaseComponent: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Firebase Authentication</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn}>Sign In</button>
        </div>
      )}
    </div>
  );
};

export default FirebaseComponent; 