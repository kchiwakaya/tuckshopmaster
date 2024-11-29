"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import AddProductDialog from "./add-product-dialog";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchInventory = async () => {
      const inventoryCollection = collection(db, "products");
      const inventorySnapshot = await getDocs(inventoryCollection);
      const inventoryList = inventorySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        sku: doc.data().sku,
        category: doc.data().category,
        price: doc.data().price,
      }));
      setInventory(inventoryList);
    };

    fetchInventory();
  }, []);

  const filteredInventory = inventory.filter(
    (item) =>
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and stock levels
          </p>
        </div>
        <Button className = "" onClick={() => setShowStockDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add stock
        </Button>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <AddProductDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
    </div>
  );
}