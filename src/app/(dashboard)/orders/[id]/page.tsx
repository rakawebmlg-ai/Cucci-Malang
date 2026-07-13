'use client';

import { useAppStore } from '@/lib/store';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS, PAYMENT_METHOD_LABELS } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { OrderStatusUpdate } from '@/components/orders/order-status-update';
import { PaymentStatusUpdate } from '@/components/orders/payment-status-update';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Image as ImageIcon 
} from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = useAppStore((s) => s.orders.find((o) => o.id === id));
  const router = useRouter();

  if (!order) {
    notFound();
  }

  const handleWhatsApp = () => {
    const text = `Halo Kak ${order.customerName}, pesanan cuci sepatu dengan No. Invoice *${order.invoiceNumber}* saat ini berstatus *${ORDER_STATUS_LABELS[order.orderStatus]}*. Terima kasih telah mempercayakan perawatan sepatu Anda kepada Cucci Malang!`;
    const url = `https://wa.me/${order.customerWhatsapp.replace(/^0/, '62')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/orders" className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
              <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              Order {order.invoiceNumber}
              <Badge variant="outline" className={ORDER_STATUS_COLORS[order.orderStatus]}>
                {ORDER_STATUS_LABELS[order.orderStatus]}
              </Badge>
            </h2>
            <p className="text-muted-foreground text-sm">
              Dibuat pada {formatDateTime(order.orderDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleWhatsApp}>
            <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
            Kirim WA
          </Button>
          <OrderStatusUpdate order={order} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Detail Pelanggan & Sepatu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Informasi Pelanggan</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium inline-block w-24">Nama:</span> {order.customerName}</p>
                    <p><span className="font-medium inline-block w-24">WhatsApp:</span> {order.customerWhatsapp}</p>
                    <p className="flex"><span className="font-medium inline-block w-24 shrink-0">Alamat:</span> <span className="text-muted-foreground">{order.customerAddress}</span></p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Informasi Sepatu</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium inline-block w-24">Merek/Tipe:</span> {order.brand} / {order.shoeType}</p>
                    <p><span className="font-medium inline-block w-24">Warna:</span> {order.color}</p>
                    <p><span className="font-medium inline-block w-24">Ukuran:</span> {order.size}</p>
                    <p><span className="font-medium inline-block w-24">Kondisi:</span> {order.condition}</p>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="mt-6 bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium mb-1">Catatan Pesanan:</p>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Rincian Layanan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="h-10 px-4 text-left font-medium">Layanan</th>
                      <th className="h-10 px-4 text-right font-medium">Harga</th>
                      <th className="h-10 px-4 text-center font-medium">Qty</th>
                      <th className="h-10 px-4 text-right font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="p-4">{item.serviceName}</td>
                        <td className="p-4 text-right">{formatCurrency(item.price)}</td>
                        <td className="p-4 text-center">{item.qty}</td>
                        <td className="p-4 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <div className="w-full sm:w-1/2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-destructive">
                      <span>Diskon</span>
                      <span>-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Pajak</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Section (Mock) */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Foto Kondisi Sepatu</CardTitle>
              <CardDescription>Foto sebelum dan sesudah pengerjaan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-dashed border-border rounded-lg h-48 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <ImageIcon className="w-8 h-8 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Upload Foto Sebelum</span>
                </div>
                <div className="border border-dashed border-border rounded-lg h-48 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <ImageIcon className="w-8 h-8 text-muted-foreground mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Upload Foto Sesudah</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Status & Payment */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Status Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={PAYMENT_STATUS_COLORS[order.paymentStatus]}>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                  </Badge>
                  <PaymentStatusUpdate order={order} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Metode</span>
                <span className="text-sm">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tagihan</span>
                  <span className="font-medium">{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Telah Dibayar</span>
                  <span className="font-medium text-success">{formatCurrency(order.amountPaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sisa Pembayaran</span>
                  <span className="font-medium text-destructive">{formatCurrency(order.remaining)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Timeline Pengerjaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Estimasi Selesai</span>
                  <span className="font-medium">{formatDateTime(order.estimatedDate)}</span>
                </div>
                {order.completedDate && (
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Waktu Selesai</span>
                    <span className="font-medium text-success">{formatDateTime(order.completedDate)}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {order.statusHistory.map((history, i) => {
                  const isLast = i === order.statusHistory.length - 1;
                  return (
                    <div key={i} className="relative flex items-start group">
                      <div className="absolute left-0 w-10 flex justify-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${isLast ? 'border-primary bg-background' : 'border-muted-foreground bg-muted-foreground'}`} />
                      </div>
                      <div className="pl-10 pb-4">
                        <p className="font-medium text-sm">{ORDER_STATUS_LABELS[history.status]}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDateTime(history.timestamp)}
                        </p>
                        {history.note && (
                          <p className="text-xs mt-2 bg-muted p-2 rounded-md italic">"{history.note}"</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
