"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import NewSaleDialog from "./new-sale-dialog";

const sales = [
  {
    id: 1,
    date: "2024-03-20",
    customer: "John Doe",
    items: 3,
    total: 1299.97,
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-03-20",
    customer: "Jane Smith",
    items: 2,
    total: 799.98,
    status: "Pending",
  },
  {
    id: 3,
    date: "2024-03-19",
    customer: "Bob Johnson",
    items: 1,
    total: 99.99,
    status: "Completed",
  },
];

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewSaleDialog, setShowNewSaleDialog] = useState(false);

  const filteredSales = sales.filter(
    (sale) =>
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toString().includes(searchTerm)
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Sales Management</h1>
          <p className="text-muted-foreground">
            Track and manage your sales transactions
          </p>
        </div>
        <Button onClick={() => setShowNewSaleDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Sale
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,099.95</div>
            <p className="text-xs text-muted-foreground">
              5 transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Weekly Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,456.78</div>
            <p className="text-xs text-muted-foreground">
              32 transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$48,352.15</div>
            <p className="text-xs text-muted-foreground">
              128 transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>#{sale.id.toString().padStart(4, '0')}</TableCell>
              <TableCell>{sale.date}</TableCell>
              <TableCell>{sale.customer}</TableCell>
              <TableCell>{sale.items}</TableCell>
              <TableCell>${sale.total.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    sale.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {sale.status}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <NewSaleDialog open={showNewSaleDialog} onClose={() => setShowNewSaleDialog(false)} />
    </div>
  );
}