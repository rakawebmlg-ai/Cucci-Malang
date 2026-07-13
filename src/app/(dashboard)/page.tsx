'use client';

import { useAppStore } from '@/lib/store';
import { StatCards } from '@/components/dashboard/stat-cards';
import { DashboardCharts } from '@/components/dashboard/charts';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default function DashboardPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Selamat datang kembali, {currentUser?.name || 'Admin'}! Berikut ringkasan bisnis Anda hari ini.
          </p>
        </div>
      </div>

      <StatCards />

      {currentUser?.role === 'admin' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2">
            <DashboardCharts />
          </div>
          <div className="xl:col-span-1 mt-6 xl:mt-0">
            <RecentActivity />
          </div>
        </div>
      )}

      {currentUser?.role === 'kasir' && (
        <div className="grid grid-cols-1 gap-6 mt-6">
          <RecentActivity />
        </div>
      )}
    </div>
  );
}
