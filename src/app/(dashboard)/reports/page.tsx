'use client';

import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/dashboard/charts';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
  const orders = useAppStore((s) => s.orders);
  const payments = useAppStore((s) => s.payments);
  const expenses = useAppStore((s) => s.expenses);

  // Simple overall calculations for the top cards
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalOrders = orders.length;

  const handleExportPDF = () => {
    toast.info('Fitur Export PDF akan tersedia di versi produksi', {
      description: 'Saat ini Anda bisa melihat preview visual dari laporan'
    });
  };

  const handleExportExcel = () => {
    toast.info('Fitur Export Excel akan tersedia di versi produksi');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Laporan Keuangan & Analitik</h2>
          <p className="text-muted-foreground">
            Pantau performa bisnis dan kesehatan keuangan Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileText className="w-4 h-4 mr-2 text-green-600" />
            Export Excel
          </Button>
          <Button variant="default" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Keseluruhan waktu</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">Keseluruhan waktu</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Laba Bersih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(netProfit)}</div>
            <p className="text-xs text-muted-foreground mt-1">Pendapatan dikurangi pengeluaran</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Jumlah pesanan masuk</p>
          </CardContent>
        </Card>
      </div>

      {/* Reuse the dashboard charts here as they perfectly fit the report module requirements */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Grafik Performa</h3>
        <DashboardCharts />
      </div>
    </div>
  );
}
