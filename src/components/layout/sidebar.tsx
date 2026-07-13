'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  ShoppingBag,
  Calculator,
  Users,
  Sparkles,
  FileText,
  CreditCard,
  TrendingDown,
  BarChart3,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  Footprints,
  Moon,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Order', icon: ShoppingBag },
  { href: '/cashier', label: 'Kasir', icon: Calculator },
  { href: '/customers', label: 'Pelanggan', icon: Users },
  { href: '/services', label: 'Layanan', icon: Sparkles },
  { href: '/invoices', label: 'Invoice', icon: FileText },
  { href: '/payments', label: 'Pembayaran', icon: CreditCard },
  { href: '/expenses', label: 'Pengeluaran', icon: TrendingDown },
  { href: '/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/users', label: 'Pengguna', icon: UserCog },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const settings = useAppStore((s) => s.settings);
  const currentUser = useAppStore((s) => s.currentUser);
  const { theme, setTheme } = useTheme();

  const filteredMenuItems = menuItems.filter(item => {
    if (currentUser?.role === 'kasir') {
      const kasirRoutes = ['/', '/orders', '/cashier', '/customers', '/services', '/invoices'];
      return kasirRoutes.includes(item.href);
    }
    return true; // Admin sees everything
  });

  return (
    <aside
      className={cn(
        'sidebar fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out no-print',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-sidebar-border shrink-0',
        collapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Footprints className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-base font-bold text-sidebar-foreground truncate">
              {settings.businessName}
            </h1>
            <p className="text-[11px] text-muted-foreground truncate">Management System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        <ul className="space-y-0.5">
          {filteredMenuItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'w-[18px] h-[18px] shrink-0 transition-transform duration-200',
                    !isActive && 'group-hover:scale-110'
                  )}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger render={linkContent} />
                    <TooltipContent side="right" sideOffset={10}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            }

            return <li key={item.href}>{linkContent}</li>;
          })}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className={cn(
        'border-t border-sidebar-border p-2.5 space-y-1 shrink-0',
        collapsed && 'flex flex-col items-center'
      )}>
        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'w-9 h-9 p-0 justify-center'
          )}
        >
          {theme === 'dark' ? (
            <Sun className="w-[18px] h-[18px] shrink-0" />
          ) : (
            <Moon className="w-[18px] h-[18px] shrink-0" />
          )}
          {!collapsed && (
            <span className="text-sm">{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
          )}
        </Button>

        {/* Collapse toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'w-9 h-9 p-0 justify-center'
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] shrink-0" />
          ) : (
            <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
          )}
          {!collapsed && <span className="text-sm">Kecilkan Sidebar</span>}
        </Button>
      </div>
    </aside>
  );
}
