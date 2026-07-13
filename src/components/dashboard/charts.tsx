'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils/format';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const COLORS = [
  'hsl(150, 55%, 45%)', // primary
  'hsl(200, 65%, 50%)', // blue
  'hsl(45, 90%, 50%)', // yellow
  'hsl(0, 70%, 55%)', // red
  'hsl(280, 60%, 55%)', // purple
  'hsl(25, 85%, 55%)', // orange
  'hsl(180, 70%, 45%)', // cyan
];

export function DashboardCharts() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // Data
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);

  const orders = useAppStore((s) => s.orders);
  const payments = useAppStore((s) => s.payments);

  useEffect(() => {
    // Generate revenue & order data for the last 30 days
    const newRevenueData = [];
    const newOrderData = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      
      const dayOrders = orders.filter((o) => {
        const od = new Date(o.orderDate);
        return od.toDateString() === d.toDateString();
      });
      
      const revenue = dayOrders.reduce((acc, o) => acc + o.amountPaid, 0);
      newRevenueData.push({ date: dateStr, pendapatan: revenue });
      newOrderData.push({ date: dateStr, order: dayOrders.length });
    }
    setRevenueData(newRevenueData);
    setOrderData(newOrderData);

    // Order status data
    const statusCount: Record<string, number> = {};
    orders.forEach((o) => {
      const label =
        o.orderStatus === 'baru' ? 'Baru' :
        o.orderStatus === 'dicuci' ? 'Dicuci' :
        o.orderStatus === 'pengeringan' ? 'Pengeringan' :
        o.orderStatus === 'finishing' ? 'Finishing' :
        o.orderStatus === 'qc' ? 'QC' :
        o.orderStatus === 'siap_diambil' ? 'Siap Diambil' :
        o.orderStatus === 'selesai' ? 'Selesai' : 'Sudah Diambil';
      statusCount[label] = (statusCount[label] || 0) + 1;
    });
    setStatusData(Object.entries(statusCount).map(([name, value]) => ({ name, value })));

    // Top services data
    const serviceCount: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        serviceCount[item.serviceName] = (serviceCount[item.serviceName] || 0) + item.qty;
      });
    });
    setServicesData(
      Object.entries(serviceCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6)
    );

    // Payment method data
    const methodCount: Record<string, number> = {};
    payments.forEach((p) => {
      const label =
        p.method === 'tunai' ? 'Tunai' :
        p.method === 'transfer_bank' ? 'Transfer' :
        p.method === 'qris' ? 'QRIS' :
        p.method === 'gopay' ? 'GoPay' :
        p.method === 'ovo' ? 'OVO' :
        p.method === 'dana' ? 'DANA' : 'ShopeePay';
      methodCount[label] = (methodCount[label] || 0) + 1;
    });
    setPaymentData(Object.entries(methodCount).map(([name, value]) => ({ name, value })));

    setMounted(true);
  }, [orders, payments]);

  if (!mounted) {
    return <div className="h-[400px] w-full skeleton rounded-xl" />;
  }

  const textColor = theme === 'dark' ? '#a1a1aa' : '#71717a';
  const gridColor = theme === 'dark' ? '#27272a' : '#e4e4e7';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Revenue Chart */}
      <Card className="col-span-1 lg:col-span-2 shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Pendapatan 30 Hari Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={textColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp ${value / 1000}k`}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value as number), 'Pendapatan']}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="pendapatan" stroke={COLORS[0]} strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Orders Chart */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Jumlah Order Harian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <Tooltip
                  cursor={{ fill: theme === 'dark' ? '#27272a' : '#f4f4f5' }}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="order" fill={COLORS[1]} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Services Chart */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Layanan Terlaris</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicesData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke={textColor} fontSize={12} tickLine={false} axisLine={false} width={100} />
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <Tooltip
                  cursor={{ fill: theme === 'dark' ? '#27272a' : '#f4f4f5' }}
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill={COLORS[4]} radius={[0, 4, 4, 0]} barSize={20}>
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Status Chart */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Status Order</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm w-full">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="truncate">{entry.name}</span>
                <span className="font-semibold ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Chart */}
      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6">
          <div className="h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm w-full">
            {paymentData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS[(index + 3) % COLORS.length] }} />
                <span className="truncate">{entry.name}</span>
                <span className="font-semibold ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
