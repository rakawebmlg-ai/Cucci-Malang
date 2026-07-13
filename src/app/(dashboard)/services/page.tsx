'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Service } from '@/lib/types';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function ServicesPage() {
  const services = useAppStore((s) => s.services);
  const addService = useAppStore((s) => s.addService);
  const updateService = useAppStore((s) => s.updateService);
  const deleteService = useAppStore((s) => s.deleteService);

  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [estimationDays, setEstimationDays] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openAddForm = () => {
    setEditingService(null);
    setName('');
    setPrice('');
    setEstimationDays('');
    setDescription('');
    setIsActive(true);
    setFormOpen(true);
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price);
    setEstimationDays(service.estimationDays);
    setDescription(service.description);
    setIsActive(service.isActive);
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!name || price === '' || estimationDays === '') {
      toast.error('Nama, Harga, dan Estimasi Hari wajib diisi');
      return;
    }

    if (editingService) {
      updateService(editingService.id, { 
        name, 
        price: Number(price), 
        estimationDays: Number(estimationDays), 
        description, 
        isActive 
      });
      toast.success('Layanan berhasil diperbarui');
    } else {
      addService({ 
        name, 
        price: Number(price), 
        estimationDays: Number(estimationDays), 
        description, 
        isActive 
      });
      toast.success('Layanan baru berhasil ditambahkan');
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteService(deleteId);
      toast.success('Layanan berhasil dihapus');
      setDeleteId(null);
    }
  };

  const toggleStatus = (service: Service) => {
    updateService(service.id, { isActive: !service.isActive });
    toast.success(`Layanan ${service.name} ${!service.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  const columns: ColumnDef<Service>[] = [
    {
      accessorKey: 'name',
      header: 'Nama Layanan',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      cell: ({ row }) => {
        const desc = row.getValue('description') as string;
        return <span className="text-muted-foreground truncate max-w-[300px] block">{desc || '-'}</span>;
      },
    },
    {
      accessorKey: 'price',
      header: 'Harga',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(row.getValue('price'))}</span>,
    },
    {
      accessorKey: 'estimationDays',
      header: 'Estimasi (Hari)',
      cell: ({ row }) => <span className="text-center block">{row.getValue('estimationDays')}</span>,
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const active = row.getValue('isActive') as boolean;
        return (
          <Badge variant={active ? 'default' : 'secondary'} className={active ? 'bg-success text-success-foreground' : ''}>
            {active ? 'Aktif' : 'Nonaktif'}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const service = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleStatus(service)}>
                <Switch checked={service.isActive} className="mr-2 scale-75" />
                {service.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditForm(service)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Layanan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteId(service.id)} className="text-destructive focus:text-destructive">
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
          <h2 className="text-2xl font-bold tracking-tight">Katalog Layanan</h2>
          <p className="text-muted-foreground">
            Kelola daftar layanan cuci, harga, dan estimasi pengerjaan.
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Layanan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={services}
        searchKey="name"
        searchPlaceholder="Cari nama layanan..."
      />

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Layanan' : 'Tambah Layanan'}</DialogTitle>
            <DialogDescription>
              Atur detail layanan yang ditawarkan ke pelanggan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Layanan *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Deep Cleaning" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Harga (Rp) *</Label>
                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')} placeholder="85000" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimation">Estimasi (Hari) *</Label>
                <Input id="estimation" type="number" value={estimationDays} onChange={(e) => setEstimationDays(e.target.value ? Number(e.target.value) : '')} placeholder="3" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Penjelasan singkat layanan..." />
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg mt-2">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Status Aktif</Label>
                <p className="text-xs text-muted-foreground">Tampilkan layanan ini di kasir</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
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
            <AlertDialogTitle>Hapus Layanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Layanan akan dihapus dari sistem kasir.
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
