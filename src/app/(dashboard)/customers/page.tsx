'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Customer } from '@/lib/types';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Edit, Trash2, History } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function CustomersPage() {
  const customers = useAppStore((s) => s.customers);
  const addCustomer = useAppStore((s) => s.addCustomer);
  const updateCustomer = useAppStore((s) => s.updateCustomer);
  const deleteCustomer = useAppStore((s) => s.deleteCustomer);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');

  const openAddForm = () => {
    setEditingCustomer(null);
    setName('');
    setWhatsapp('');
    setAddress('');
    setFormOpen(true);
  };

  const openEditForm = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setWhatsapp(customer.whatsapp);
    setAddress(customer.address);
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!name || !whatsapp) {
      toast.error('Nama dan WhatsApp wajib diisi');
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, { name, whatsapp, address });
      toast.success('Data pelanggan berhasil diperbarui');
    } else {
      addCustomer({ name, whatsapp, address });
      toast.success('Pelanggan baru berhasil ditambahkan');
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCustomer(deleteId);
      toast.success('Pelanggan berhasil dihapus');
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Nama',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'whatsapp',
      header: 'WhatsApp',
    },
    {
      accessorKey: 'address',
      header: 'Alamat',
      cell: ({ row }) => {
        const address = row.getValue('address') as string;
        return <span className="text-muted-foreground truncate max-w-[200px] block">{address || '-'}</span>;
      },
    },
    {
      accessorKey: 'totalOrders',
      header: 'Total Order',
      cell: ({ row }) => <span className="text-center block">{row.getValue('totalOrders')}</span>,
    },
    {
      accessorKey: 'totalSpent',
      header: 'Total Belanja',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.getValue('totalSpent'))}</span>,
    },
    {
      accessorKey: 'joinedAt',
      header: 'Bergabung',
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.getValue('joinedAt'))}</span>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info('Fitur riwayat order sedang dikembangkan')}>
                <History className="w-4 h-4 mr-2" />
                Riwayat Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditForm(customer)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteId(customer.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
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
          <h2 className="text-2xl font-bold tracking-tight">Pelanggan</h2>
          <p className="text-muted-foreground">
            Kelola data dan riwayat pelanggan Anda.
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pelanggan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Cari nama pelanggan..."
      />

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}</DialogTitle>
            <DialogDescription>
              Masukkan informasi detail pelanggan di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Budi Santoso" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
              <Input id="whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="Contoh: 081234567890" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap pengiriman/penjemputan" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pelanggan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Riwayat pesanan pelanggan ini mungkin akan kehilangan referensi.
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
