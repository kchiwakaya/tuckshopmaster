'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig'; // Import Firestore
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AddProduct: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productNames, setProductNames] = useState<string[]>([]); // State to hold product names
    const [purchasePrice, setPurchasePrice] = useState(0); // State to hold purchase price

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
                purchasePrice: purchasePrice, // Include purchase price in the document
            });
            // Clear the form
            setProductName('');
            setProductPrice(0);
            setPurchasePrice(0); // Clear purchase price
        } catch (error) {
            console.error("Error adding product: ", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-1/3">
                <label className="block mb-2" htmlFor="productName">Select a Product</label>
                <select
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                >
                    <option value="" disabled>Select a Product</option>
                    {productNames.map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                    ))}
                </select>

                <label className="block mb-2" htmlFor="productPrice">Product Price</label>
                <input
                    id="productPrice"
                    type="number"
                    placeholder="Product Price"
                    value={productPrice}
                    onChange={(e) => setProductPrice(Number(e.target.value))}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <input
                    type="number"
                    placeholder="Purchase Price"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    required
                    className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct; 