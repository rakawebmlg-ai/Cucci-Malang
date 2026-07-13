'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/types';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Eye, Plus, MoreHorizontal, Printer, Trash2, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const orders = useAppStore((s) => s.orders);
  const services = useAppStore((s) => s.services);
  const deleteOrder = useAppStore((s) => s.deleteOrder);
  const router = useRouter();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filters state
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const handleDatePreset = (val: string | null) => {
    const preset = val || '';
    setDateFilter(preset);
    if (preset !== 'custom') {
      setDateFrom('');
      setDateTo('');
    }
  };

  const filteredOrders = useMemo(() => orders.filter((order) => {
    if (serviceFilter) {
      const hasService = order.items.some((item) => item.serviceId === serviceFilter);
      if (!hasService) return false;
    }
    if (statusFilter && order.orderStatus !== statusFilter) return false;
    if (paymentFilter && order.paymentStatus !== paymentFilter) return false;
    
    if (dateFilter) {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      if (dateFilter === 'hari_ini') {
        if (orderDate.toDateString() !== today.toDateString()) return false;
      } else if (dateFilter === 'bulan_ini') {
        if (orderDate.getMonth() !== today.getMonth() || orderDate.getFullYear() !== today.getFullYear()) return false;
      } else if (dateFilter === 'custom') {
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          if (orderDate < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (orderDate > to) return false;
        }
      }
    }
    return true;
  }), [orders, serviceFilter, statusFilter, paymentFilter, dateFilter, dateFrom, dateTo]);

  const handleDelete = () => {
    if (deleteId) {
      deleteOrder(deleteId);
      toast.success('Order berhasil dihapus');
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Order>[] = [
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
      accessorKey: 'items',
      header: 'Layanan',
      cell: ({ row }) => {
        const items = row.original.items;
        return (
          <div className="flex flex-wrap gap-1">
            {items.map((item, i) => (
              <Badge variant="secondary" key={i} className="text-[10px]">
                {item.serviceName}
              </Badge>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'orderStatus',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.orderStatus;
        return (
          <Badge variant="outline" className={ORDER_STATUS_COLORS[status]}>
            {ORDER_STATUS_LABELS[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Pembayaran',
      cell: ({ row }) => {
        const status = row.original.paymentStatus;
        return (
          <Badge variant="outline" className={PAYMENT_STATUS_COLORS[status]}>
            {PAYMENT_STATUS_LABELS[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.getValue('total'))}</span>,
    },
    {
      accessorKey: 'orderDate',
      header: 'Tanggal Masuk',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDateTime(row.getValue('orderDate'))}</span>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(`/orders/${order.id}`)}>
                <Eye className="w-4 h-4 mr-2" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Fitur cetak akan segera tersedia')}>
                <Printer className="w-4 h-4 mr-2" />
                Cetak Invoice
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteId(order.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Daftar Order</h2>
          <p className="text-muted-foreground">
            Kelola semua pesanan cuci sepatu pelanggan Anda.
          </p>
        </div>
        <Link href="/cashier" className={buttonVariants()}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Order
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        searchKey="customerName"
        searchPlaceholder="Cari nama pelanggan..."
        filterContent={
          <>
            <Select value={serviceFilter} onValueChange={(val) => setServiceFilter(val || '')}>
              <SelectTrigger className="h-9 w-[150px] bg-background text-xs">
                <SelectValue placeholder="Filter Layanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Layanan</SelectItem>
                {services.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || '')}>
              <SelectTrigger className="h-9 w-[150px] bg-background text-xs">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Status</SelectItem>
                {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={(val) => setPaymentFilter(val || '')}>
              <SelectTrigger className="h-9 w-[150px] bg-background text-xs">
                <SelectValue placeholder="Filter Bayar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Pembayaran</SelectItem>
                {Object.entries(PAYMENT_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={handleDatePreset}>
              <SelectTrigger className="h-9 w-[150px] bg-background text-xs">
                <CalendarDays className="w-3 h-3 mr-1 shrink-0" />
                <SelectValue placeholder="Filter Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Tanggal</SelectItem>
                <SelectItem value="hari_ini">Hari Ini</SelectItem>
                <SelectItem value="bulan_ini">Bulan Ini</SelectItem>
                <SelectItem value="custom">Pilih Tanggal...</SelectItem>
              </SelectContent>
            </Select>
            {dateFilter === 'custom' && (
              <>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-9 px-2 text-xs border rounded-md bg-background"
                  title="Dari tanggal"
                />
                <span className="text-xs text-muted-foreground">—</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-9 px-2 text-xs border rounded-md bg-background"
                  title="Sampai tanggal"
                />
              </>
            )}
          </>
        }
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Order akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
