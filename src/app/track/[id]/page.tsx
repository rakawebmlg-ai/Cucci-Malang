import React from 'react';
import { supabase } from '@/lib/supabase';
import { Order, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_COLORS, ORDER_STATUS_COLORS } from '@/lib/types';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle2 } from 'lucide-react';

// Next.js page params
interface TrackPageProps {
  params: Promise<{
    id: string; // The invoice number
  }>;
}

export const dynamic = 'force-dynamic';

export default async function TrackPage({ params }: TrackPageProps) {
  const resolvedParams = await params;
  const invoiceNumber = resolvedParams.id;

  // Fetch the order from Supabase
  const { data: orderData, error } = await supabase
    .from('orders')
    .select('*')
    .eq('invoice_number', invoiceNumber)
    .single();

  if (error || !orderData) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Pesanan Tidak Ditemukan</h2>
        <p className="text-muted-foreground">Maaf, kami tidak dapat menemukan pesanan dengan nomor invoice <strong>{invoiceNumber}</strong>.</p>
        <p className="text-sm text-muted-foreground mt-4">Silakan periksa kembali URL atau scan ulang QR Code pada struk Anda.</p>
      </div>
    );
  }

  // Convert raw data back to our Order type interface
  const order: Order = {
    ...orderData,
    invoiceNumber: orderData.invoice_number,
    customerId: orderData.customer_id,
    customerName: orderData.customer_name,
    customerWhatsapp: orderData.customer_whatsapp,
    customerAddress: orderData.customer_address,
    shoeType: orderData.shoe_type,
    amountPaid: orderData.amount_paid,
    paymentMethod: orderData.payment_method,
    paymentStatus: orderData.payment_status,
    orderStatus: orderData.order_status,
    statusHistory: orderData.status_history,
    orderDate: orderData.order_date,
    estimatedDate: orderData.estimated_date,
    completedDate: orderData.completed_date,
    createdAt: orderData.created_at,
    updatedAt: orderData.updated_at,
  };

  const isCompleted = ['selesai', 'sudah_diambil'].includes(order.orderStatus);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Cucci Malang</h1>
        <p className="text-muted-foreground">Pelacakan Status Pesanan</p>
      </div>

      <Card className="border-border shadow-md overflow-hidden">
        <div className="bg-slate-100 dark:bg-slate-900 px-6 py-4 border-b border-border flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">No. Invoice</p>
            <p className="font-mono font-bold text-lg">{order.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Tanggal</p>
            <p className="text-sm font-medium">{new Date(order.orderDate).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Informasi Pelanggan & Sepatu</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Nama</span>
              <span className="font-medium text-right">{order.customerName}</span>
              
              <span className="text-muted-foreground">Merek / Tipe</span>
              <span className="font-medium text-right">{order.brand} / {order.shoeType}</span>
              
              <span className="text-muted-foreground">Warna / Ukuran</span>
              <span className="font-medium text-right">{order.color} / {order.size}</span>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Status Pembayaran</h3>
              <Badge variant="outline" className={PAYMENT_STATUS_COLORS[order.paymentStatus]}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-muted-foreground">Total Tagihan</span>
              <span className="font-bold text-right">{formatCurrency(order.total)}</span>
              
              <span className="text-muted-foreground">Dibayar</span>
              <span className="font-medium text-right text-success">{formatCurrency(order.amountPaid)}</span>
              
              {order.remaining > 0 && (
                <>
                  <span className="text-muted-foreground">Sisa</span>
                  <span className="font-medium text-right text-destructive">{formatCurrency(order.remaining)}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card className="border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Timeline Pengerjaan
            <Badge variant="outline" className={ORDER_STATUS_COLORS[order.orderStatus]}>
              {ORDER_STATUS_LABELS[order.orderStatus]}
            </Badge>
          </CardTitle>
          <CardDescription>
            Estimasi selesai: {new Date(order.estimatedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {order.statusHistory.map((history, i) => {
              const isLast = i === order.statusHistory.length - 1;
              const isDone = ['selesai', 'sudah_diambil'].includes(history.status);
              
              return (
                <div key={i} className="relative flex items-start group">
                  <div className="absolute left-0 md:left-1/2 w-10 md:-ml-5 flex justify-center">
                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${isLast ? 'border-primary bg-primary text-primary-foreground' : 'border-muted bg-background text-muted-foreground'} shadow-sm z-10`}>
                      {isDone && isLast ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                    </div>
                  </div>
                  <div className={`pl-12 md:pl-0 pb-6 w-full md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                    <p className={`font-bold text-base ${isLast ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {ORDER_STATUS_LABELS[history.status]}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center md:inline-flex gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(history.timestamp)}
                    </p>
                    {history.note && (
                      <p className="text-xs mt-2 bg-muted/50 p-2 rounded-md italic">"{history.note}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground pb-8">
        <p>Terima kasih telah mempercayakan perawatan sepatu Anda kepada kami!</p>
      </div>
    </div>
  );
}
