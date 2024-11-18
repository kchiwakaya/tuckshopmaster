"use client";
import React, { useState } from 'react';

const CashBook: React.FC = () => {
    const [transactions, setTransactions] = useState<{ date: string; amount: number; description: string }[]>([]);
    const [newTransaction, setNewTransaction] = useState({ date: '', amount: 0, description: '' });

    const addTransaction = () => {
        setTransactions([...transactions, newTransaction]);
        setNewTransaction({ date: '', amount: 0, description: '' }); // Reset form
    };

    return (
        <div>
            <h1>Cash Book</h1>
            <input
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            />
            <input
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
            />
            <input
                type="text"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            />
            <button onClick={addTransaction}>Add Transaction</button>

            <h2>Transactions</h2>
            <ul>
                {transactions.map((transaction, index) => (
                    <li key={index}>
                        {transaction.date} - {transaction.amount} - {transaction.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CashBook;