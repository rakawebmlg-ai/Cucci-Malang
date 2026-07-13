// ==========================================
// Shoe Laundry POS — Type Definitions
// ==========================================

export type OrderStatus =
  | 'baru'
  | 'dicuci'
  | 'pengeringan'
  | 'finishing'
  | 'qc'
  | 'siap_diambil'
  | 'selesai'
  | 'sudah_diambil';

export type PaymentStatus = 'belum_bayar' | 'dp' | 'lunas';

export type PaymentMethod =
  | 'tunai'
  | 'transfer_bank'
  | 'qris'
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'shopeepay';

export type UserRole = 'admin' | 'kasir';

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  estimationDays: number;
  description: string;
  isActive: boolean;
  icon?: string;
}

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  qty: number;
  price: number;
  subtotal: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerWhatsapp: string;
  customerAddress: string;
  shoeType: string;
  brand: string;
  color: string;
  size: string;
  condition: string;
  photoBefore?: string;
  photoAfter?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountPaid: number;
  remaining: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistory[];
  orderDate: string;
  estimatedDate: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  note?: string;
}

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BusinessSettings {
  businessName: string;
  logo?: string;
  address: string;
  whatsapp: string;
  invoiceFooter: string;
  operatingHours: string;
  invoicePrefix: string;
  taxRate: number;
}

export interface DashboardStats {
  totalCustomers: number;
  ordersToday: number;
  ordersThisMonth: number;
  ordersInProgress: number;
  ordersReadyForPickup: number;
  ordersCompleted: number;
  revenueToday: number;
  revenueThisMonth: number;
  expensesThisMonth: number;
  netProfit: number;
}

// Label maps for display
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  baru: 'Baru',
  dicuci: 'Dicuci',
  pengeringan: 'Pengeringan',
  finishing: 'Finishing',
  qc: 'Quality Control',
  siap_diambil: 'Siap Diambil',
  selesai: 'Selesai',
  sudah_diambil: 'Sudah Diambil',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  belum_bayar: 'Belum Bayar',
  dp: 'DP',
  lunas: 'Lunas',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  tunai: 'Tunai',
  transfer_bank: 'Transfer Bank',
  qris: 'QRIS',
  gopay: 'GoPay',
  ovo: 'OVO',
  dana: 'DANA',
  shopeepay: 'ShopeePay',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  baru: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  dicuci: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  pengeringan: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  finishing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  qc: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  siap_diambil: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  selesai: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  sudah_diambil: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  belum_bayar: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  dp: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  lunas: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export const EXPENSE_CATEGORIES = [
  'Bahan Cuci',
  'Operasional',
  'Gaji',
  'Sewa',
  'Listrik & Air',
  'Peralatan',
  'Marketing',
  'Transportasi',
  'Lain-lain',
];
