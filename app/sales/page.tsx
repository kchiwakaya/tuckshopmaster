"use client";

import { useState, useEffect } from "react";
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
import { app } from "../../firebaseConfig";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

interface Sale {
  id: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  total: number;
  status: string;
  paymentMethod: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewSaleDialog, setShowNewSaleDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page
  const [todaysSalesTotal, setTodaysSalesTotal] = useState(0); // Added state for today's sales total
  const [todaysSalesCount, setTodaysSalesCount] = useState(0); // Added state for today's sales count
  const [weeklySalesTotal, setWeeklySalesTotal] = useState(0); // Added state for weekly sales total
  const [weeklySalesCount, setWeeklySalesCount] = useState(0); // Added state for weekly sales count
  const [monthlySalesTotal, setMonthlySalesTotal] = useState(0); // Added state for monthly sales total
  const [monthlySalesCount, setMonthlySalesCount] = useState(0); // Added state for monthly sales count

  useEffect(() => {
    const fetchSales = async () => {
      const salesCollection = collection(db, "sales");
      const salesSnapshot = await getDocs(salesCollection);
      const salesData = salesSnapshot.docs.map(doc => ({
        id: doc.id,
        createdAt: doc.data().createdAt.toDate().toString(),
        items: doc.data().items.map((item: { id: string; name: string; price: number; quantity: number; total: number; }) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        })),
        total: doc.data().total,
        status: doc.data().status,
        paymentMethod: doc.data().paymentMethod,
      }));
      setSales(salesData);

      // Calculate today's sales
      const today = new Date();
      const todaysSales = salesData.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getFullYear() === today.getFullYear() &&
               saleDate.getMonth() === today.getMonth() &&
               saleDate.getDate() === today.getDate();
      });

      const totalToday = todaysSales.reduce((acc, sale) => acc + sale.total, 0);
      setTodaysSalesTotal(totalToday);
      setTodaysSalesCount(todaysSales.length);

      // Calculate weekly sales
      const startOfWeek = new Date();
      startOfWeek.setDate(today.getDate() - today.getDay()); //

      // Calculate monthly sales
      const startOfMonth = new Date();
      startOfMonth.setDate(1);

      // Calculate weekly sales
      const weeklySales = salesData.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        const start = new Date(saleDate.getFullYear(), 0, 1);
        const end = new Date(saleDate.getFullYear(), 11, 31);
        return saleDate >= start && saleDate <= end;
      });

      const weeklySalesTotal = weeklySales.reduce((acc, sale) => acc + sale.total, 0);
      setWeeklySalesTotal(weeklySalesTotal);
      setWeeklySalesCount(weeklySales.length);

      // Calculate monthly sales
      const monthlySales = salesData.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear();
      });

      const monthlySalesTotal = monthlySales.reduce((acc, sale) => acc + sale.total, 0);
      setMonthlySalesTotal(monthlySalesTotal);
      setMonthlySalesCount(monthlySales.length);
    };

    fetchSales();
  }, []);

  const filteredSales = sales.filter(
    (sale) =>
      sale.id.toString().includes(searchTerm)
  );

  const indexOfLastSale = currentPage * itemsPerPage;
  const indexOfFirstSale = indexOfLastSale - itemsPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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
            <div className="text-2xl font-bold">${todaysSalesTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {todaysSalesCount} transactions
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
            <div className="text-2xl font-bold">${weeklySalesTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {weeklySalesCount} transactions
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
            <div className="text-2xl font-bold">${monthlySalesTotal.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {monthlySalesCount} transactions
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
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{new Date(sale.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {sale.items.map(item => (
                  <div key={item.id}>
                    {item.name} (Qty: {item.quantity})
                  </div>
                ))}
              </TableCell>
              <TableCell>${sale.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between">
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
      </div>

      <NewSaleDialog open={showNewSaleDialog} onClose={() => setShowNewSaleDialog(false)} />
    </div>
  );
}