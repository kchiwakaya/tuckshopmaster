import { getFirestore, collection } from 'firebase/firestore';
import app from '../../firebaseConfig'; // Adjust the path as necessary

const db = getFirestore(app); // Initialize Firestore
export const productsCollection = collection(db, 'products'); // Reference to the 'products' collection 