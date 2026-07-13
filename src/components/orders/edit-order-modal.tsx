import { useState, useEffect } from 'react';
import { Order, OrderItem, PaymentMethod, PaymentStatus, OrderStatus } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils/format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditOrderModal({ order, isOpen, onClose }: EditOrderModalProps) {
  const updateOrder = useAppStore((s) => s.updateOrder);
  const addPayment = useAppStore((s) => s.addPayment);

  // Form State
  const [items, setItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('tunai');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('belum_bayar');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('baru');
  
  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const total = subtotal - discount + tax;
  const originalAmountPaid = order?.amountPaid || 0;
  
  // Decide how much is paid based on status change
  let amountPaid = originalAmountPaid;
  if (paymentStatus === 'lunas') {
    amountPaid = total;
  } else if (paymentStatus === 'belum_bayar') {
    amountPaid = 0;
  }
  const remaining = Math.max(0, total - amountPaid);

  useEffect(() => {
    if (order) {
      // deep copy items to avoid mutating state directly
      setItems(order.items.map(item => ({ ...item })));
      setDiscount(order.discount);
      setTax(order.tax);
      setPaymentMethod(order.paymentMethod);
      setPaymentStatus(order.paymentStatus);
      setOrderStatus(order.orderStatus);
    }
  }, [order]);

  const handleSave = () => {
    if (!order) return;
    
    if (items.length === 0) {
      toast.error('Order harus memiliki minimal 1 layanan');
      return;
    }

    updateOrder(order.id, {
      items,
      subtotal,
      discount,
      tax,
      total,
      amountPaid,
      remaining,
      paymentMethod,
      paymentStatus,
      orderStatus,
    });

    // If payment status changed to lunas and it wasn't, record a payment
    if (paymentStatus === 'lunas' && order.paymentStatus !== 'lunas') {
      addPayment({
        orderId: order.id,
        invoiceNumber: order.invoiceNumber,
        customerName: order.customerName,
        amount: total - originalAmountPaid,
        method: paymentMethod,
        status: 'lunas',
        date: new Date().toISOString(),
      });
    }

    toast.success('Data order berhasil diperbarui');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Data Order</DialogTitle>
          <DialogDescription>
            Ubah rincian layanan, diskon, atau status pada invoice {order?.invoiceNumber}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Layanan */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Daftar Layanan</Label>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} x {formatCurrency(item.price)}</p>
                  </div>
                  <span className="font-semibold text-sm">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-destructive text-center py-2">Tidak ada layanan yang tersisa.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Diskon */}
            <div className="space-y-2">
              <Label>Diskon (Rp)</Label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            
            {/* Status Order */}
            <div className="space-y-2">
              <Label>Status Cucian</Label>
              <Select value={orderStatus} onValueChange={(v: string | null) => { if (v) setOrderStatus(v as OrderStatus); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baru">Baru</SelectItem>
                  <SelectItem value="dicuci">Dicuci</SelectItem>
                  <SelectItem value="qc">Quality Control</SelectItem>
                  <SelectItem value="siap_diambil">Siap Diambil</SelectItem>
                  <SelectItem value="siap_diantar">Siap Diantar</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Metode Pembayaran */}
            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select value={paymentMethod} onValueChange={(v: string | null) => { if (v) setPaymentMethod(v as PaymentMethod); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tunai">Tunai</SelectItem>
                  <SelectItem value="transfer_bank">Transfer Bank</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                  <SelectItem value="gopay">GoPay</SelectItem>
                  <SelectItem value="ovo">OVO</SelectItem>
                  <SelectItem value="dana">DANA</SelectItem>
                  <SelectItem value="shopeepay">ShopeePay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Pembayaran */}
            <div className="space-y-2">
              <Label>Status Pembayaran</Label>
              <Select value={paymentStatus} onValueChange={(v: string | null) => { if (v) setPaymentStatus(v as PaymentStatus); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                  <SelectItem value="dp">DP (Uang Muka)</SelectItem>
                  <SelectItem value="lunas">Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Diskon</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t mt-2">
              <span>Total Baru</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="text-muted-foreground">Sudah Dibayar</span>
              <span>{formatCurrency(amountPaid)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-primary pt-1">
              <span>Sisa Tagihan</span>
              <span>{formatCurrency(remaining)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={items.length === 0}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
