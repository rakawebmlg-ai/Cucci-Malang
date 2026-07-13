'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { User, UserRole } from '@/lib/types';
import { DataTable } from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Edit, Trash2, Key } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function UsersPage() {
  const users = useAppStore((s) => s.users);
  const currentUser = useAppStore((s) => s.currentUser);
  const addUser = useAppStore((s) => s.addUser);
  const updateUser = useAppStore((s) => s.updateUser);
  const deleteUser = useAppStore((s) => s.deleteUser);

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('kasir');
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState(''); // Only used for creation in this UI mock

  const openAddForm = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setRole('kasir');
    setIsActive(true);
    setPassword('');
    setFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setIsActive(user.isActive);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!name || !email) {
      toast.error('Nama dan Email wajib diisi');
      return;
    }

    if (!editingUser && !password) {
      toast.error('Password wajib diisi untuk pengguna baru');
      return;
    }

    if (editingUser) {
      await updateUser(editingUser.id, { name, email, role, isActive }, password || undefined);
      toast.success('Data pengguna berhasil diperbarui');
    } else {
      await addUser({ name, email, role, isActive }, password);
      toast.success('Pengguna baru berhasil ditambahkan');
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      if (deleteId === currentUser?.id) {
        toast.error('Anda tidak dapat menghapus akun Anda sendiri');
        setDeleteId(null);
        return;
      }
      await deleteUser(deleteId);
      toast.success('Pengguna berhasil dihapus');
      setDeleteId(null);
    }
  };

  const toggleStatus = async (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('Anda tidak dapat menonaktifkan akun Anda sendiri');
      return;
    }
    await updateUser(user.id, { isActive: !user.isActive });
    toast.success(`Akun ${user.name} ${!user.isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
  };

  const handleResetPassword = () => {
    toast.success('Tautan reset password telah dikirim ke email pengguna');
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Nama Pengguna',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
            {row.original.name.substring(0, 2).toUpperCase()}
          </div>
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant="outline" className="capitalize">
            {role}
          </Badge>
        );
      },
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
      accessorKey: 'createdAt',
      header: 'Dibuat Pada',
      cell: ({ row }) => <span className="text-sm">{formatDate(row.getValue('createdAt'))}</span>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleStatus(user)} disabled={user.id === currentUser?.id}>
                <Switch checked={user.isActive} className="mr-2 scale-75" />
                {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditForm(user)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetPassword}>
                <Key className="w-4 h-4 mr-2" />
                Reset Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteId(user.id)} 
                disabled={user.id === currentUser?.id}
                className="text-destructive focus:text-destructive"
              >
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
          <h2 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">
            Kelola akses Admin dan Kasir untuk aplikasi ini.
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Cari nama pengguna..."
      />

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
            <DialogDescription>
              Atur informasi akun untuk staf Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Kasir Andi" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="andi@cuccimalang.com" />
            </div>
            {!editingUser && (
              <div className="grid gap-2">
                <Label htmlFor="password">Password Awal *</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="role">Role / Peran *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin (Akses Penuh)</SelectItem>
                  <SelectItem value="kasir">Kasir (Hanya Transaksi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg mt-2">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Status Akun</Label>
                <p className="text-xs text-muted-foreground">Akun aktif dapat digunakan untuk login</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} disabled={editingUser?.id === currentUser?.id} />
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
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Akun ini tidak akan dapat digunakan untuk login kembali.
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
