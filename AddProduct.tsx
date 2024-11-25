import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; // Import Firestore
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AddProduct: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productNames, setProductNames] = useState<string[]>([]); // State to hold product names

    useEffect(() => {
        const fetchProductNames = async () => {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const names: string[] = [];
            querySnapshot.forEach((doc) => {
                names.push(doc.data().name); // Assuming each product has a 'name' field
            });
            setProductNames(names);
        };

        fetchProductNames();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Add a new document with a generated ID
            await addDoc(collection(db, 'products'), {
                name: productName,
                price: productPrice,
            });
            // Clear the form
            setProductName('');
            setProductPrice(0);
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
            >
                <option value="" disabled>Select a Product</option>
                {productNames.map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Product Price"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                required
            />
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProduct; 