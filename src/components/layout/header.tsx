'use client';

import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils/format';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './sidebar';

export function Header() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  const settings = useAppStore((s) => s.settings);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header
      className={cn(
        'header-bar fixed top-0 right-0 z-30 h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-6 transition-all duration-300 no-print',
        collapsed ? 'left-0 md:left-[70px]' : 'left-0 md:left-[260px]'
      )}
    >
      {/* Left: Mobile menu */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Sheet>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          } />
          <SheetContent side="left" className="p-0 w-[260px]">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      {/* Right: Profile */}
      <div className="flex items-center gap-2">

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 rounded-full" />}>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{currentUser ? getInitials(currentUser.name) : 'AD'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold">{currentUser?.name || 'Admin Utama'}</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email || 'admin@cuccimalang.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <User className="w-4 h-4 mr-2" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
