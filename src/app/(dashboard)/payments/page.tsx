'use client';

import { useAppStore } from '@/lib/store';
import { Payment, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/types';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentsPage() {
  const payments = useAppStore((s) => s.payments);

  // Calculate simple stats
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = payments.length;

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'No. Invoice',
      cell: ({ row }) => <span className="font-medium">{row.getValue('invoiceNumber')}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Pelanggan',
    },
    {
      accessorKey: 'date',
      header: 'Tanggal',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDateTime(row.getValue('date'))}</span>,
    },
    {
      accessorKey: 'method',
      header: 'Metode',
      cell: ({ row }) => {
        const method = row.getValue('method') as Payment['method'];
        return <span>{PAYMENT_METHOD_LABELS[method]}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as Payment['status'];
        return (
          <Badge variant="outline" className={PAYMENT_STATUS_COLORS[status]}>
            {PAYMENT_STATUS_LABELS[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Nominal',
      cell: ({ row }) => <span className="font-bold text-success">{formatCurrency(row.getValue('amount'))}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Pembayaran</h2>
          <p className="text-muted-foreground">
            Riwayat seluruh transaksi pembayaran pelanggan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penerimaan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Total seluruh pembayaran masuk</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Transaksi</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground mt-1">Transaksi sukses</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        searchKey="invoiceNumber"
        searchPlaceholder="Cari nomor invoice..."
      />
    </div>
  );
}
