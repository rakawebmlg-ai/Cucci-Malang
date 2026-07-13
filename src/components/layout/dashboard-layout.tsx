'use client';

import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const currentUser = useAppStore((s) => s.currentUser);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      useAppStore.getState().initialize();
    }
  }, [isAuthenticated, router]);

  // Protect kasir from admin routes
  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'kasir') {
      const restrictedRoutes = ['/expenses', '/reports', '/users', '/settings', '/payments'];
      if (restrictedRoutes.some(route => pathname.startsWith(route))) {
        router.push('/');
      }
    }
  }, [isAuthenticated, currentUser, pathname, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Header */}
      <Header />

      {/* Main content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          collapsed ? 'md:pl-[70px]' : 'md:pl-[260px]'
        )}
      >
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
