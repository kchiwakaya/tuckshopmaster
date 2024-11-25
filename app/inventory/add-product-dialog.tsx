"use client";

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
import { useState } from "react";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductDialog({ open, onClose }: AddProductDialogProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const firestore = getFirestore();

  const handleSubmit = async () => {
    try {
      await addDoc(collection(firestore, "products"), {
        name,
        sku,
        category,
        price,
      });
      onClose();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" placeholder="Enter SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">Clear Beer</SelectItem>
                <SelectItem value="Opaque">Opaque Beer</SelectItem>
                <SelectItem value="Biscuits">Biscuits</SelectItem>
                <SelectItem value="Snax">Snax</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Soft">Soft Drinks</SelectItem>
                <SelectItem value="Spirits">Spirits</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Selling Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Product</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}