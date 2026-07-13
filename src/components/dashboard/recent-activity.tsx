'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatTimeAgo, formatCurrency } from '@/lib/utils/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/types';
import { ShoppingBag, CheckCircle, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function RecentActivity() {
  const orders = useAppStore((s) => s.orders);
  const payments = useAppStore((s) => s.payments);

  // Get 5 most recent activities (mix of orders and payments)
  const activities = [
    ...orders.slice(0, 5).map((o) => ({
      id: `act-ord-${o.id}`,
      type: 'order' as const,
      title: 'Order Baru Masuk',
      description: `${o.customerName} - ${o.invoiceNumber}`,
      amount: o.total,
      date: o.orderDate,
      status: o.orderStatus,
    })),
    ...payments.slice(0, 5).map((p) => ({
      id: `act-pay-${p.id}`,
      type: 'payment' as const,
      title: 'Pembayaran Diterima',
      description: `${p.customerName} (${p.method.toUpperCase()})`,
      amount: p.amount,
      date: p.date,
      status: null,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
          <CardDescription>Order dan pembayaran terakhir</CardDescription>
        </div>
        <Link href="/orders" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:flex')}>
            Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="mt-0.5">
                {activity.type === 'order' && activity.status === 'baru' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                )}
                {activity.type === 'order' && activity.status !== 'baru' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                {activity.type === 'payment' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatTimeAgo(activity.date)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  <p className="text-sm font-medium whitespace-nowrap ml-2">
                    {formatCurrency(activity.amount)}
                  </p>
                </div>
                {activity.type === 'order' && activity.status && (
                  <div className="pt-1">
                    <Badge variant="outline" className={ORDER_STATUS_COLORS[activity.status]}>
                      {ORDER_STATUS_LABELS[activity.status]}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Link href="/orders" className={cn(buttonVariants({ variant: 'outline' }), 'w-full mt-6 sm:hidden')}>Lihat Semua Aktivitas</Link>
      </CardContent>
    </Card>
  );
}
