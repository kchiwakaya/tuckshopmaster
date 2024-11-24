"use client";
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const CashBook: React.FC = () => {
    const [transactions, setTransactions] = useState<{ date: string; amount: number; description: string }[]>([]);
    const [newTransaction, setNewTransaction] = useState({ date: '', amount: 0, description: '' });
    const [cashAvailable, setCashAvailable] = useState(0);

    const addTransaction = () => {
        if (newTransaction.date && newTransaction.amount > 0 && newTransaction.description) {
            setTransactions([...transactions, newTransaction]);
            setNewTransaction({ date: '', amount: 0, description: '' }); // Reset form
        } else {
            alert("Please fill in all fields with valid data.");
        }
    };

    const depositCash = (amount: number) => {
        setCashAvailable(cashAvailable + amount);
    };

    const withdrawCash = (amount: number) => {
        if (cashAvailable >= amount) {
            setCashAvailable(cashAvailable - amount);
        } else {
            alert("Insufficient funds for withdrawal");
        }
    };

    const deleteTransaction = (index: number) => {
        const updatedTransactions = transactions.filter((_, i) => i !== index);
        setTransactions(updatedTransactions);
    };

    return (
        <div className="p-8 space-y-8">
            <div className="space-y-4 text-left">
                <h1 className="text-3xl font-bold">Cash Book</h1>
                <p className="text-muted-foreground">Manage your cash transactions</p>
            </div>

            {/* Cash card section */}
            <div className="flex justify-center">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="max-w-xs">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cash Available</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${cashAvailable}</div>
                            <div className="space-x-2">
                                <button onClick={() => depositCash(10)} className="btn">Deposit $10</button>
                                <button onClick={() => withdrawCash(10)} className="btn">Withdraw $10</button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Transaction input section */}
            <div className="flex justify-center">
                <div className="w-full max-w-md space-y-4"> {/* Centered and limited width */}
                    <h2 className="text-xl font-semibold text-center">Add Transaction</h2>
                    <div className="flex flex-col space-y-4">
                        <input
                            type="date"
                            value={newTransaction.date}
                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                            className="input"
                        />
                        <input
                            type="number"
                            value={newTransaction.amount}
                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                            placeholder="Amount"
                            className="input"
                        />
                        <input
                            type="text"
                            value={newTransaction.description}
                            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                            placeholder="Description"
                            className="input"
                        />
                        <button 
                            onClick={addTransaction} 
                            className="btn bg-blue-500 text-white hover:bg-blue-600 transition duration-200"
                        >
                            Add Transaction
                        </button>
                    </div>
                </div>
            </div>

            {/* Transactions list */}
            <h2 className="text-xl font-semibold">Transactions</h2>
            <ul className="space-y-2">
                {transactions.map((transaction, index) => (
                    <li key={index} className="flex justify-between items-center p-2 border rounded">
                        <span>{transaction.date} - ${transaction.amount} - {transaction.description}</span>
                        <button onClick={() => deleteTransaction(index)} className="btn btn-sm btn-danger">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CashBook;