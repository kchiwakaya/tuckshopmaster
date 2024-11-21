"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { productsCollection } from './productsCollection';

// Your web app's Firebase configuration
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

interface NewSaleDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function NewSaleDialog({ open, onClose }: NewSaleDialogProps) {
  const [items, setItems] = useState<Array<{ id: number; name: string; quantity: number; price: number }>>([]);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(productsCollection);
      const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    const newTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotal(newTotal);
  };

  const handleCompleteSale = async () => {
    try {
      const saleData = {
        items,
        total,
        paymentMethod,
        createdAt: new Date(),
      };
      console.log("Sale Data:", saleData);
      await addDoc(collection(db, "sales"), saleData);
      alert("Sale completed successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to complete sale.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">USD Cash</SelectItem>
                  <SelectItem value="card">Zig Cash</SelectItem>
                  <SelectItem value="ecocashzw">Ecocash Zig</SelectItem>
                  <SelectItem value="ecocashusd">Ecocash USD</SelectItem>
                  <SelectItem value="rand">Rand</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                Add Item
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Select
                        onValueChange={(value) => {
                          const newItems = [...items];
                          const index = newItems.findIndex((i) => i.id === item.id);
                          newItems[index].name = value;
                          setItems(newItems);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={product.name}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...items];
                          const index = newItems.findIndex((i) => i.id === item.id);
                          newItems[index].quantity = parseInt(e.target.value);
                          setItems(newItems);
                          calculateTotal();
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => {
                          const newItems = [...items];
                          const index = newItems.findIndex((i) => i.id === item.id);
                          newItems[index].price = parseFloat(e.target.value);
                          setItems(newItems);
                          calculateTotal();
                        }}
                      />
                    </TableCell>
                    <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No items added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-lg font-semibold">
              Total: ${total.toFixed(2)}
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleCompleteSale}>Complete Sale</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}