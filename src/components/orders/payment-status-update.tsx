'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Order, PaymentStatus, PAYMENT_STATUS_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PaymentStatusUpdateProps {
  order: Order;
  trigger?: React.ReactElement;
}

const paymentStatuses: PaymentStatus[] = [
  'belum_bayar',
  'dp',
  'lunas',
];

export function PaymentStatusUpdate({ order, trigger }: PaymentStatusUpdateProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [amountPaid, setAmountPaid] = useState<number>(order.amountPaid);
  const updateOrder = useAppStore((s) => s.updateOrder);
  const addPayment = useAppStore((s) => s.addPayment);

  const handleSubmit = () => {
    if (status === order.paymentStatus && amountPaid === order.amountPaid) {
      setOpen(false);
      return;
    }

    // Logic to calculate remaining
    let finalAmountPaid = amountPaid;
    if (status === 'lunas') {
      finalAmountPaid = order.total;
    } else if (status === 'belum_bayar') {
      finalAmountPaid = 0;
    }

    const remaining = order.total - finalAmountPaid;
    const diff = finalAmountPaid - order.amountPaid;

    updateOrder(order.id, {
      paymentStatus: status,
      amountPaid: finalAmountPaid,
      remaining: remaining,
    });
    
    if (diff > 0) {
      addPayment({
        orderId: order.id,
        invoiceNumber: order.invoiceNumber,
        customerName: order.customerName,
        amount: diff,
        method: order.paymentMethod || 'tunai',
        status: status,
        date: new Date().toISOString(),
        note: `Update pembayaran: ${PAYMENT_STATUS_LABELS[status]}`,
      });
    }

    toast.success('Status pembayaran berhasil diupdate');
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || <Button variant="outline" size="sm">Update Pembayaran</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Status Pembayaran</DialogTitle>
          <DialogDescription>
            Ubah status pembayaran untuk order {order.invoiceNumber}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="payment-status">Status Pembayaran</Label>
            <Select value={status} onValueChange={(v) => {
              const newStatus = v as PaymentStatus;
              setStatus(newStatus);
              if (newStatus === 'lunas') {
                setAmountPaid(order.total);
              } else if (newStatus === 'belum_bayar') {
                setAmountPaid(0);
              }
            }}>
              <SelectTrigger id="payment-status">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {PAYMENT_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {status === 'dp' && (
            <div className="grid gap-2">
              <Label htmlFor="amount-paid">Jumlah Dibayar (DP)</Label>
              <Input
                id="amount-paid"
                type="number"
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                placeholder="Masukkan nominal DP"
              />
              <p className="text-xs text-muted-foreground">Total tagihan: Rp {order.total.toLocaleString('id-ID')}</p>
            </div>
          )}
          
          <Button onClick={handleSubmit} className="w-full mt-2">
            Simpan Perubahan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
