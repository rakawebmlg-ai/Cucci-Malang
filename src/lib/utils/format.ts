import { format, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy', { locale: id });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy, HH:mm', { locale: id });
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function formatTimeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: id });
}

export function generateInvoiceNumber(date?: Date): string {
  const d = date || new Date();
  const dateStr = format(d, 'yyyyMMdd');
  const random = Math.floor(Math.random() * 9999) + 1;
  return `INV-${dateStr}-${String(random).padStart(4, '0')}`;
}

export function generateId(): string {
  // Use crypto.randomUUID() for valid Supabase UUIDs
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback if crypto is not available
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function calculateSubtotal(items: { qty: number; price: number }[]): number {
  return items.reduce((acc, item) => acc + item.qty * item.price, 0);
}

export function calculateTotal(
  subtotal: number,
  discount: number,
  taxRate: number
): { tax: number; total: number } {
  const afterDiscount = subtotal - discount;
  const tax = Math.round(afterDiscount * (taxRate / 100));
  const total = afterDiscount + tax;
  return { tax, total };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
  const url = `https://wa.me/${formattedPhone}`;
  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }
  return url;
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    console.warn('Web Crypto API not available. Cannot hash password securely.');
    return password;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
