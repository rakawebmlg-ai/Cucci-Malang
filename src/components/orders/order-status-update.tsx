'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Order, OrderStatus, ORDER_STATUS_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface OrderStatusUpdateProps {
  order: Order;
  trigger?: React.ReactElement;
}

const statusOrder: OrderStatus[] = [
  'baru',
  'dicuci',
  'pengeringan',
  'finishing',
  'qc',
  'siap_diambil',
  'selesai',
  'sudah_diambil',
];

export function OrderStatusUpdate({ order, trigger }: OrderStatusUpdateProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.orderStatus);
  const [note, setNote] = useState('');
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus);

  const handleSubmit = () => {
    if (status === order.orderStatus) {
      setOpen(false);
      return;
    }

    updateOrderStatus(order.id, status, note || undefined);
    
    // Simulate WhatsApp notification
    toast.success('Status berhasil diupdate', {
      description: 'Notifikasi WhatsApp telah dikirim ke pelanggan (dummy).',
    });
    
    setOpen(false);
    setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || <Button variant="outline">Update Status</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Status Pengerjaan</DialogTitle>
          <DialogDescription>
            Ubah status pesanan untuk {order.invoiceNumber}. Pelanggan akan menerima notifikasi.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status Baru</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {statusOrder.map((s) => (
                  <SelectItem 
                    key={s} 
                    value={s}
                    disabled={statusOrder.indexOf(s) < statusOrder.indexOf(order.orderStatus)}
                  >
                    {ORDER_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Catatan Tambahan (Opsional)</Label>
            <Textarea
              id="note"
              placeholder="Contoh: Noda membandel perlu waktu ekstra..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
