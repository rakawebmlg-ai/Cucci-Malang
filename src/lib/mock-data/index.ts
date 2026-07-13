import {
  Customer,
  Service,
  Order,
  Payment,
  Expense,
  User,
  BusinessSettings,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@/lib/types';

// ==========================================
// Business Settings
// ==========================================
export const defaultSettings: BusinessSettings = {
  businessName: 'Cucci Malang',
  address: 'Jl. Sudirman No. 123, Jakarta Selatan 12190',
  whatsapp: '08123456789',
  invoiceFooter: 'Terima kasih telah menggunakan jasa kami.',
  operatingHours: '08:00 - 21:00',
  invoicePrefix: 'INV',
  taxRate: 0,
};

// ==========================================
// Services
// ==========================================
export const mockServices: Service[] = [
  {
    id: 'svc-001',
    name: 'Deep Cleaning',
    price: 85000,
    estimationDays: 3,
    description: 'Pembersihan menyeluruh hingga ke bagian dalam sepatu',
    isActive: true,
    icon: 'sparkles',
  },
  {
    id: 'svc-002',
    name: 'Fast Cleaning',
    price: 55000,
    estimationDays: 1,
    description: 'Pembersihan cepat untuk sepatu yang sedikit kotor',
    isActive: true,
    icon: 'zap',
  },
  {
    id: 'svc-003',
    name: 'Repaint',
    price: 150000,
    estimationDays: 5,
    description: 'Cat ulang sepatu untuk tampilan baru',
    isActive: true,
    icon: 'paintbrush',
  },
  {
    id: 'svc-004',
    name: 'Unyellowing',
    price: 75000,
    estimationDays: 3,
    description: 'Menghilangkan noda kuning pada sol sepatu',
    isActive: true,
    icon: 'sun',
  },
  {
    id: 'svc-005',
    name: 'Whitening',
    price: 80000,
    estimationDays: 3,
    description: 'Pemutihan sepatu putih agar kembali cerah',
    isActive: true,
    icon: 'star',
  },
  {
    id: 'svc-006',
    name: 'Leather Care',
    price: 120000,
    estimationDays: 4,
    description: 'Perawatan khusus untuk sepatu kulit',
    isActive: true,
    icon: 'shield',
  },
  {
    id: 'svc-007',
    name: 'Suede Cleaning',
    price: 95000,
    estimationDays: 3,
    description: 'Pembersihan khusus material suede',
    isActive: true,
    icon: 'feather',
  },
  {
    id: 'svc-008',
    name: 'Sandal Cleaning',
    price: 35000,
    estimationDays: 1,
    description: 'Pembersihan sandal berbagai jenis',
    isActive: true,
    icon: 'footprints',
  },
  {
    id: 'svc-009',
    name: 'Cuci Tas',
    price: 100000,
    estimationDays: 3,
    description: 'Pembersihan tas dari berbagai material',
    isActive: true,
    icon: 'briefcase',
  },
  {
    id: 'svc-010',
    name: 'Cuci Topi',
    price: 30000,
    estimationDays: 2,
    description: 'Pembersihan topi dan cap',
    isActive: true,
    icon: 'hard-hat',
  },
];

// ==========================================
// Customers
// ==========================================
export const mockCustomers: Customer[] = [
  { id: 'cust-001', name: 'Ahmad Rizky', whatsapp: '081234567890', address: 'Jl. Kebon Jeruk No. 45, Jakarta Barat', joinedAt: '2026-01-15', totalOrders: 12, totalSpent: 1250000 },
  { id: 'cust-002', name: 'Siti Nurhaliza', whatsapp: '082345678901', address: 'Jl. Menteng Raya No. 12, Jakarta Pusat', joinedAt: '2026-02-10', totalOrders: 8, totalSpent: 890000 },
  { id: 'cust-003', name: 'Budi Santoso', whatsapp: '083456789012', address: 'Jl. Kemang Selatan No. 78, Jakarta Selatan', joinedAt: '2026-01-20', totalOrders: 15, totalSpent: 1680000 },
  { id: 'cust-004', name: 'Diana Putri', whatsapp: '084567890123', address: 'Jl. Pluit Karang No. 33, Jakarta Utara', joinedAt: '2026-03-05', totalOrders: 5, totalSpent: 475000 },
  { id: 'cust-005', name: 'Eko Prasetyo', whatsapp: '085678901234', address: 'Jl. Cempaka Putih No. 21, Jakarta Pusat', joinedAt: '2026-02-28', totalOrders: 9, totalSpent: 1050000 },
  { id: 'cust-006', name: 'Fitri Handayani', whatsapp: '086789012345', address: 'Jl. Sunter Agung No. 56, Jakarta Utara', joinedAt: '2026-04-12', totalOrders: 3, totalSpent: 310000 },
  { id: 'cust-007', name: 'Gilang Ramadan', whatsapp: '087890123456', address: 'Jl. Tebet Barat No. 89, Jakarta Selatan', joinedAt: '2026-03-18', totalOrders: 7, totalSpent: 780000 },
  { id: 'cust-008', name: 'Hesti Wulandari', whatsapp: '088901234567', address: 'Jl. Grogol No. 15, Jakarta Barat', joinedAt: '2026-05-01', totalOrders: 4, totalSpent: 420000 },
  { id: 'cust-009', name: 'Irfan Hakim', whatsapp: '089012345678', address: 'Jl. Kelapa Gading No. 67, Jakarta Utara', joinedAt: '2026-04-25', totalOrders: 11, totalSpent: 1320000 },
  { id: 'cust-010', name: 'Jessica Tanoesoedibjo', whatsapp: '081123456789', address: 'Jl. Sudirman No. 200, Jakarta Selatan', joinedAt: '2026-01-08', totalOrders: 20, totalSpent: 2500000 },
  { id: 'cust-011', name: 'Kevin Sanjaya', whatsapp: '082234567890', address: 'Jl. Pantai Indah Kapuk No. 11, Jakarta Utara', joinedAt: '2026-05-15', totalOrders: 6, totalSpent: 650000 },
  { id: 'cust-012', name: 'Lina Marlina', whatsapp: '083345678901', address: 'Jl. Cipete Raya No. 34, Jakarta Selatan', joinedAt: '2026-06-01', totalOrders: 2, totalSpent: 170000 },
  { id: 'cust-013', name: 'Muhammad Fadil', whatsapp: '084456789012', address: 'Jl. Tanjung Duren No. 88, Jakarta Barat', joinedAt: '2026-03-22', totalOrders: 8, totalSpent: 920000 },
  { id: 'cust-014', name: 'Nadia Safitri', whatsapp: '085567890123', address: 'Jl. Rawamangun No. 50, Jakarta Timur', joinedAt: '2026-06-10', totalOrders: 1, totalSpent: 85000 },
  { id: 'cust-015', name: 'Oscar Pratama', whatsapp: '086678901234', address: 'Jl. Pondok Indah No. 77, Jakarta Selatan', joinedAt: '2026-02-14', totalOrders: 13, totalSpent: 1450000 },
  { id: 'cust-016', name: 'Putri Ayu', whatsapp: '087789012345', address: 'Jl. Cikini No. 23, Jakarta Pusat', joinedAt: '2026-04-08', totalOrders: 6, totalSpent: 540000 },
  { id: 'cust-017', name: 'Reza Rahadian', whatsapp: '088890123456', address: 'Jl. Bintaro No. 99, Tangerang Selatan', joinedAt: '2026-05-20', totalOrders: 4, totalSpent: 380000 },
  { id: 'cust-018', name: 'Sari Dewi', whatsapp: '089901234567', address: 'Jl. Senayan No. 44, Jakarta Selatan', joinedAt: '2026-06-15', totalOrders: 2, totalSpent: 170000 },
  { id: 'cust-019', name: 'Tommy Kurniawan', whatsapp: '081212345678', address: 'Jl. Daan Mogot No. 150, Jakarta Barat', joinedAt: '2026-01-30', totalOrders: 10, totalSpent: 1100000 },
  { id: 'cust-020', name: 'Ulfah Maulida', whatsapp: '082323456789', address: 'Jl. Pramuka No. 60, Jakarta Timur', joinedAt: '2026-06-25', totalOrders: 1, totalSpent: 55000 },
];

// ==========================================
// Helper to generate dates
// ==========================================
function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// ==========================================
// Orders
// ==========================================
const statuses: OrderStatus[] = ['baru', 'dicuci', 'pengeringan', 'finishing', 'qc', 'siap_diambil', 'selesai', 'sudah_diambil'];
const paymentMethods: PaymentMethod[] = ['tunai', 'transfer_bank', 'qris', 'gopay', 'ovo', 'dana', 'shopeepay'];
const paymentStatuses: PaymentStatus[] = ['belum_bayar', 'dp', 'lunas'];
const shoeTypes = ['Sneakers', 'Running Shoes', 'Boots', 'Casual', 'Formal', 'Sandal', 'Slip On', 'High Heels'];
const brands = ['Nike', 'Adidas', 'New Balance', 'Converse', 'Vans', 'Puma', 'Reebok', 'Asics', 'Skechers', 'Under Armour'];
const colors = ['Putih', 'Hitam', 'Abu-abu', 'Biru', 'Merah', 'Hijau', 'Coklat', 'Cream', 'Navy', 'Pink'];
const sizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
const conditions = ['Kotor ringan', 'Kotor sedang', 'Sangat kotor', 'Bernoda', 'Berjamur', 'Menguning'];

function buildStatusHistory(status: OrderStatus, orderDate: string): { status: OrderStatus; timestamp: string; note?: string }[] {
  const idx = statuses.indexOf(status);
  const history: { status: OrderStatus; timestamp: string; note?: string }[] = [];
  const baseDate = new Date(orderDate);
  for (let i = 0; i <= idx; i++) {
    const d = new Date(baseDate);
    d.setHours(d.getHours() + i * 8);
    history.push({ status: statuses[i], timestamp: d.toISOString() });
  }
  return history;
}

function createOrder(
  index: number,
  custIndex: number,
  serviceIndices: number[],
  status: OrderStatus,
  payMethod: PaymentMethod,
  payStatus: PaymentStatus,
  daysAgoVal: number,
  discount: number = 0,
): Order {
  const customer = mockCustomers[custIndex];
  const items = serviceIndices.map((si) => ({
    serviceId: mockServices[si].id,
    serviceName: mockServices[si].name,
    qty: 1,
    price: mockServices[si].price,
    subtotal: mockServices[si].price,
  }));
  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const tax = 0;
  const total = subtotal - discount + tax;
  const orderDate = daysAgo(daysAgoVal);
  const estimatedDate = daysFromNow(3 - daysAgoVal > 0 ? 3 - daysAgoVal : 0);
  const amountPaid = payStatus === 'lunas' ? total : payStatus === 'dp' ? Math.round(total * 0.5) : 0;

  return {
    id: `ord-${String(index).padStart(3, '0')}`,
    invoiceNumber: `INV-20260${String(7 - Math.floor(daysAgoVal / 30)).padStart(1, '0')}${String(Math.max(1, 30 - daysAgoVal)).padStart(2, '0')}-${String(index).padStart(4, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    customerWhatsapp: customer.whatsapp,
    customerAddress: customer.address,
    shoeType: shoeTypes[index % shoeTypes.length],
    brand: brands[index % brands.length],
    color: colors[index % colors.length],
    size: sizes[index % sizes.length],
    condition: conditions[index % conditions.length],
    items,
    subtotal,
    discount,
    tax,
    total,
    amountPaid,
    remaining: total - amountPaid,
    paymentMethod: payMethod,
    paymentStatus: payStatus,
    orderStatus: status,
    statusHistory: buildStatusHistory(status, orderDate),
    orderDate,
    estimatedDate,
    completedDate: ['selesai', 'sudah_diambil'].includes(status) ? daysAgo(daysAgoVal - 2) : undefined,
    notes: index % 3 === 0 ? 'Pelanggan minta extra wangi' : undefined,
    createdAt: orderDate,
    updatedAt: daysAgo(Math.max(0, daysAgoVal - 1)),
  };
}

export const mockOrders: Order[] = [
  // Today's orders
  createOrder(1, 0, [0], 'baru', 'tunai', 'lunas', 0),
  createOrder(2, 1, [1], 'baru', 'qris', 'dp', 0),
  createOrder(3, 2, [0, 3], 'dicuci', 'transfer_bank', 'lunas', 0),
  createOrder(4, 3, [1], 'baru', 'gopay', 'belum_bayar', 0),
  createOrder(5, 4, [4], 'dicuci', 'dana', 'lunas', 0, 10000),

  // Yesterday
  createOrder(6, 5, [0], 'pengeringan', 'tunai', 'lunas', 1),
  createOrder(7, 6, [2], 'dicuci', 'ovo', 'dp', 1),
  createOrder(8, 7, [5], 'finishing', 'qris', 'lunas', 1),
  createOrder(9, 8, [1, 4], 'pengeringan', 'transfer_bank', 'lunas', 1),

  // 2 days ago
  createOrder(10, 9, [0], 'qc', 'tunai', 'lunas', 2),
  createOrder(11, 10, [6], 'finishing', 'shopeepay', 'dp', 2),
  createOrder(12, 11, [7], 'siap_diambil', 'gopay', 'lunas', 2),
  createOrder(13, 12, [0, 2], 'qc', 'qris', 'lunas', 2, 15000),

  // 3 days ago
  createOrder(14, 13, [1], 'siap_diambil', 'tunai', 'lunas', 3),
  createOrder(15, 14, [3], 'siap_diambil', 'transfer_bank', 'lunas', 3),
  createOrder(16, 15, [8], 'selesai', 'dana', 'lunas', 3),

  // 4-5 days ago
  createOrder(17, 16, [0], 'selesai', 'tunai', 'lunas', 4),
  createOrder(18, 17, [1, 6], 'selesai', 'qris', 'lunas', 4),
  createOrder(19, 18, [4], 'sudah_diambil', 'ovo', 'lunas', 5),
  createOrder(20, 19, [2], 'sudah_diambil', 'gopay', 'lunas', 5),

  // 6-10 days ago
  createOrder(21, 0, [5], 'sudah_diambil', 'tunai', 'lunas', 6),
  createOrder(22, 1, [0, 4], 'sudah_diambil', 'transfer_bank', 'lunas', 7),
  createOrder(23, 2, [1], 'sudah_diambil', 'qris', 'lunas', 7),
  createOrder(24, 3, [3], 'sudah_diambil', 'dana', 'lunas', 8),
  createOrder(25, 4, [6], 'sudah_diambil', 'shopeepay', 'lunas', 8),
  createOrder(26, 5, [0], 'sudah_diambil', 'tunai', 'lunas', 9),
  createOrder(27, 6, [8], 'sudah_diambil', 'gopay', 'lunas', 9),
  createOrder(28, 7, [2], 'sudah_diambil', 'ovo', 'lunas', 10),

  // 11-20 days ago
  createOrder(29, 8, [0], 'sudah_diambil', 'tunai', 'lunas', 11),
  createOrder(30, 9, [1, 3], 'sudah_diambil', 'qris', 'lunas', 12),
  createOrder(31, 10, [4], 'sudah_diambil', 'transfer_bank', 'lunas', 13),
  createOrder(32, 11, [5], 'sudah_diambil', 'dana', 'lunas', 14),
  createOrder(33, 12, [0], 'sudah_diambil', 'gopay', 'lunas', 15, 5000),
  createOrder(34, 13, [7], 'sudah_diambil', 'tunai', 'lunas', 16),
  createOrder(35, 14, [1], 'sudah_diambil', 'shopeepay', 'lunas', 17),
  createOrder(36, 15, [2], 'sudah_diambil', 'qris', 'lunas', 18),
  createOrder(37, 16, [6], 'sudah_diambil', 'ovo', 'lunas', 19),
  createOrder(38, 17, [0, 4], 'sudah_diambil', 'tunai', 'lunas', 20),

  // 21-30 days ago
  createOrder(39, 18, [3], 'sudah_diambil', 'transfer_bank', 'lunas', 21),
  createOrder(40, 19, [1], 'sudah_diambil', 'dana', 'lunas', 22),
  createOrder(41, 0, [5], 'sudah_diambil', 'tunai', 'lunas', 23),
  createOrder(42, 1, [0], 'sudah_diambil', 'qris', 'lunas', 24, 10000),
  createOrder(43, 2, [8], 'sudah_diambil', 'gopay', 'lunas', 25),
  createOrder(44, 3, [2], 'sudah_diambil', 'shopeepay', 'lunas', 26),
  createOrder(45, 4, [1, 7], 'sudah_diambil', 'tunai', 'lunas', 27),
  createOrder(46, 5, [4], 'sudah_diambil', 'ovo', 'lunas', 28),
  createOrder(47, 6, [0], 'sudah_diambil', 'transfer_bank', 'lunas', 29),
  createOrder(48, 7, [6], 'sudah_diambil', 'dana', 'lunas', 30),
];

// ==========================================
// Payments (derived from orders)
// ==========================================
export const mockPayments: Payment[] = mockOrders
  .filter((o) => o.amountPaid > 0)
  .map((o, i) => ({
    id: `pay-${String(i + 1).padStart(3, '0')}`,
    orderId: o.id,
    invoiceNumber: o.invoiceNumber,
    customerName: o.customerName,
    amount: o.amountPaid,
    method: o.paymentMethod,
    status: o.paymentStatus,
    date: o.orderDate,
  }));

// ==========================================
// Expenses
// ==========================================
export const mockExpenses: Expense[] = [
  { id: 'exp-001', name: 'Sabun Cuci Sepatu', category: 'Bahan Cuci', amount: 250000, date: daysAgo(1), note: 'Restock bulanan' },
  { id: 'exp-002', name: 'Sikat Sepatu (10 pcs)', category: 'Peralatan', amount: 150000, date: daysAgo(3) },
  { id: 'exp-003', name: 'Listrik Bulan Juli', category: 'Listrik & Air', amount: 850000, date: daysAgo(2) },
  { id: 'exp-004', name: 'Gaji Karyawan - Andi', category: 'Gaji', amount: 3000000, date: daysAgo(5) },
  { id: 'exp-005', name: 'Gaji Karyawan - Beni', category: 'Gaji', amount: 3000000, date: daysAgo(5) },
  { id: 'exp-006', name: 'Sewa Toko Juli', category: 'Sewa', amount: 5000000, date: daysAgo(1) },
  { id: 'exp-007', name: 'Air PDAM', category: 'Listrik & Air', amount: 350000, date: daysAgo(2) },
  { id: 'exp-008', name: 'Parfum Sepatu', category: 'Bahan Cuci', amount: 180000, date: daysAgo(7) },
  { id: 'exp-009', name: 'Lem Sepatu', category: 'Bahan Cuci', amount: 120000, date: daysAgo(10) },
  { id: 'exp-010', name: 'Bensin Motor', category: 'Transportasi', amount: 100000, date: daysAgo(4) },
  { id: 'exp-011', name: 'Iklan Instagram', category: 'Marketing', amount: 500000, date: daysAgo(8) },
  { id: 'exp-012', name: 'Cat Sepatu', category: 'Bahan Cuci', amount: 350000, date: daysAgo(12) },
  { id: 'exp-013', name: 'Rak Sepatu Baru', category: 'Peralatan', amount: 750000, date: daysAgo(15) },
  { id: 'exp-014', name: 'Kertas Struk', category: 'Operasional', amount: 50000, date: daysAgo(6) },
  { id: 'exp-015', name: 'Mesin Pengering (Service)', category: 'Peralatan', amount: 400000, date: daysAgo(20) },
];

// ==========================================
// Users
// ==========================================
export const mockUsers: User[] = [
  { id: 'usr-001', name: 'Admin Utama', email: 'admin@cuccimalang.com', role: 'admin', isActive: true, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'usr-002', name: 'Kasir Andi', email: 'andi@cuccimalang.com', role: 'kasir', isActive: true, createdAt: '2026-02-15T00:00:00.000Z' },
  { id: 'usr-003', name: 'Kasir Beni', email: 'beni@cuccimalang.com', role: 'kasir', isActive: true, createdAt: '2026-03-01T00:00:00.000Z' },
  { id: 'usr-004', name: 'Admin Dina', email: 'dina@cuccimalang.com', role: 'admin', isActive: false, createdAt: '2026-01-10T00:00:00.000Z' },
];

// ==========================================
// Dashboard chart data generators
// ==========================================
export function getRevenueData30Days() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const dayOrders = mockOrders.filter((o) => {
      const od = new Date(o.orderDate);
      return od.toDateString() === d.toDateString();
    });
    const revenue = dayOrders.reduce((acc, o) => acc + o.amountPaid, 0);
    data.push({ date: dateStr, pendapatan: revenue || Math.floor(Math.random() * 300000) + 100000 });
  }
  return data;
}

export function getOrdersDaily() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const count = mockOrders.filter((o) => {
      const od = new Date(o.orderDate);
      return od.toDateString() === d.toDateString();
    }).length;
    data.push({ date: dateStr, order: count || Math.floor(Math.random() * 5) + 1 });
  }
  return data;
}

export function getOrderStatusData() {
  const statusCount: Record<string, number> = {};
  mockOrders.forEach((o) => {
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
  return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
}

export function getTopServicesData() {
  const serviceCount: Record<string, number> = {};
  mockOrders.forEach((o) => {
    o.items.forEach((item) => {
      serviceCount[item.serviceName] = (serviceCount[item.serviceName] || 0) + item.qty;
    });
  });
  return Object.entries(serviceCount)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export function getPaymentMethodData() {
  const methodCount: Record<string, number> = {};
  mockPayments.forEach((p) => {
    const label =
      p.method === 'tunai' ? 'Tunai' :
      p.method === 'transfer_bank' ? 'Transfer' :
      p.method === 'qris' ? 'QRIS' :
      p.method === 'gopay' ? 'GoPay' :
      p.method === 'ovo' ? 'OVO' :
      p.method === 'dana' ? 'DANA' : 'ShopeePay';
    methodCount[label] = (methodCount[label] || 0) + 1;
  });
  return Object.entries(methodCount).map(([name, value]) => ({ name, value }));
}

export function getDashboardStats(): {
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
} {
  const today = new Date().toDateString();
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const ordersToday = mockOrders.filter((o) => new Date(o.orderDate).toDateString() === today);
  const ordersThisMonth = mockOrders.filter((o) => {
    const d = new Date(o.orderDate);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const inProgress = mockOrders.filter((o) => ['baru', 'dicuci', 'pengeringan', 'finishing', 'qc'].includes(o.orderStatus));
  const readyForPickup = mockOrders.filter((o) => o.orderStatus === 'siap_diambil');
  const completed = mockOrders.filter((o) => ['selesai', 'sudah_diambil'].includes(o.orderStatus));

  const revenueToday = ordersToday.reduce((acc, o) => acc + o.amountPaid, 0);
  const revenueThisMonth = ordersThisMonth.reduce((acc, o) => acc + o.amountPaid, 0);
  const expensesThisMonth = mockExpenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((acc, e) => acc + e.amount, 0);

  return {
    totalCustomers: mockCustomers.length,
    ordersToday: ordersToday.length,
    ordersThisMonth: ordersThisMonth.length,
    ordersInProgress: inProgress.length,
    ordersReadyForPickup: readyForPickup.length,
    ordersCompleted: completed.length,
    revenueToday: revenueToday || 425000,
    revenueThisMonth: revenueThisMonth || 8750000,
    expensesThisMonth,
    netProfit: (revenueThisMonth || 8750000) - expensesThisMonth,
  };
}
