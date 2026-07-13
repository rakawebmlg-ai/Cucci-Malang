'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Expense, EXPENSE_CATEGORIES } from '@/lib/types';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatDate } from '@/lib/utils/format';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function ExpensesPage() {
  const expenses = useAppStore((s) => s.expenses);
  const addExpense = useAppStore((s) => s.addExpense);
  const updateExpense = useAppStore((s) => s.updateExpense);
  const deleteExpense = useAppStore((s) => s.deleteExpense);

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const openAddForm = () => {
    setEditingExpense(null);
    setName('');
    setCategory('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setFormOpen(true);
  };

  const openEditForm = (expense: Expense) => {
    setEditingExpense(expense);
    setName(expense.name);
    setCategory(expense.category);
    setAmount(expense.amount);
    setDate(expense.date.split('T')[0]);
    setNote(expense.note || '');
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!name || !category || amount === '' || !date) {
      toast.error('Semua kolom berlabel (*) wajib diisi');
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, { 
        name, 
        category, 
        amount: Number(amount), 
        date: new Date(date).toISOString(), 
        note 
      });
      toast.success('Pengeluaran berhasil diperbarui');
    } else {
      addExpense({ 
        name, 
        category, 
        amount: Number(amount), 
        date: new Date(date).toISOString(), 
        note 
      });
      toast.success('Pengeluaran baru berhasil dicatat');
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteExpense(deleteId);
      toast.success('Catatan pengeluaran berhasil dihapus');
      setDeleteId(null);
    }
  };

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'date',
      header: 'Tanggal',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.getValue('date'))}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Keterangan',
      cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'category',
      header: 'Kategori',
    },
    {
      accessorKey: 'amount',
      header: 'Nominal',
      cell: ({ row }) => <span className="font-medium text-destructive">{formatCurrency(row.getValue('amount'))}</span>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openEditForm(expense)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeleteId(expense.id)} className="text-destructive focus:text-destructive">
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
          <h2 className="text-2xl font-bold tracking-tight">Pengeluaran</h2>
          <p className="text-muted-foreground">
            Catat semua pengeluaran operasional toko Anda di sini.
          </p>
        </div>
        <Button onClick={openAddForm} variant="destructive">
          <Plus className="w-4 h-4 mr-2" />
          Catat Pengeluaran
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        searchKey="name"
        searchPlaceholder="Cari pengeluaran..."
      />

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Pengeluaran' : 'Catat Pengeluaran'}</DialogTitle>
            <DialogDescription>
              Masukkan detail pengeluaran untuk laporan keuangan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Tanggal *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Keterangan *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Beli sabun cuci" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v || '')}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Nominal (Rp) *</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Catatan Tambahan</Label>
              <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="..." />
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
            <AlertDialogTitle>Hapus Pengeluaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Laporan keuangan akan disesuaikan secara otomatis.
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
