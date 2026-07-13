'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Customer,
  Service,
  Order,
  Payment,
  Expense,
  User,
  BusinessSettings,
  OrderStatus,
  PaymentStatus,
} from '@/lib/types';
import {
  mockCustomers,
  mockServices,
  mockOrders,
  mockPayments,
  mockExpenses,
  mockUsers,
  defaultSettings,
} from '@/lib/mock-data';
import { generateId, generateInvoiceNumber } from '@/lib/utils/format';
import { supabase } from '@/lib/supabase';

interface AppState {
  initialize: () => Promise<void>;
  // Auth
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;

  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'joinedAt' | 'totalOrders' | 'totalSpent'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Order;
  updateOrder: (id: string, data: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: OrderStatus, note?: string) => void;
  deleteOrder: (id: string) => void;

  // Payments
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, data: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>, password?: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>, newPassword?: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Settings
  settings: BusinessSettings;
  updateSettings: (data: Partial<BusinessSettings>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      initialize: async () => {
        try {
          const [
            { data: customers },
            { data: services },
            { data: orders },
            { data: payments },
            { data: expenses },
            { data: users },
            { data: settings },
          ] = await Promise.all([
            supabase.from('customers').select('*').order('joined_at', { ascending: false }),
            supabase.from('services').select('*').order('name'),
            supabase.from('orders').select('*').order('order_date', { ascending: false }),
            supabase.from('payments').select('*').order('date', { ascending: false }),
            supabase.from('expenses').select('*').order('date', { ascending: false }),
            supabase.from('users').select('*'),
            supabase.from('settings').select('*').limit(1).maybeSingle(),
          ]);

          if (customers) {
            set({ customers: customers.map((c: any) => ({
              id: c.id, name: c.name, whatsapp: c.whatsapp, address: c.address || '',
              joinedAt: c.joined_at, totalOrders: c.total_orders, totalSpent: c.total_spent
            })) });
          }
          if (services) {
            set({ services: services.map((s: any) => ({
              id: s.id, name: s.name, description: s.description || '', price: s.price,
              category: s.category, estimationDays: s.estimation_days, isActive: s.is_active
            })) });
          }
          if (orders) {
            set({ orders: orders.map((o: any) => ({
              id: o.id, invoiceNumber: o.invoice_number, customerId: o.customer_id,
              customerName: o.customer_name, customerWhatsapp: o.customer_whatsapp,
              customerAddress: o.customer_address, shoeType: o.shoe_type,
              brand: o.brand, color: o.color, size: o.size || '', condition: o.condition,
              items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items, 
              subtotal: o.subtotal, discount: o.discount, tax: o.tax,
              total: o.total, amountPaid: o.amount_paid, remaining: o.remaining,
              paymentMethod: o.payment_method, paymentStatus: o.payment_status,
              orderStatus: o.order_status, statusHistory: typeof o.status_history === 'string' ? JSON.parse(o.status_history) : o.status_history || [],
              orderDate: o.order_date, estimatedDate: o.estimated_date,
              createdAt: o.created_at, updatedAt: o.updated_at
            })) });
          }
          if (payments) {
            set({ payments: payments.map((p: any) => ({
              id: p.id, orderId: p.order_id, invoiceNumber: p.invoice_number,
              customerName: p.customer_name, amount: p.amount, method: p.method,
              status: p.status, date: p.date
            })) });
          }
          if (expenses) {
            set({ expenses: expenses.map((e: any) => ({
              id: e.id, name: e.description || e.name || 'Expense', amount: e.amount,
              category: e.category, date: e.date, note: e.notes || e.note || ''
            })) });
          }
          if (users) {
            set({ users: users.map((u: any) => ({
              id: u.id, name: u.name, email: u.email, role: u.role,
              isActive: u.status === 'active' || u.status === 'Aktif', createdAt: u.created_at || new Date().toISOString()
            })) });
          }
          if (settings) {
            set({ settings: {
              businessName: settings.business_name || '', address: settings.address || '',
              whatsapp: settings.whatsapp || '', taxRate: settings.tax_rate || 0,
              invoiceFooter: settings.invoice_note || '',
              operatingHours: '08:00 - 20:00', invoicePrefix: 'INV'
            } });
          }
        } catch (error) {
          console.error('Error initializing store:', error);
        }
      },
      // Auth
      isAuthenticated: false,
      currentUser: null,
      login: async (email: string, password: string) => {
        try {
          const { hashPassword } = await import('@/lib/utils/format');
          const hashedPassword = await hashPassword(password);

          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .ilike('email', email.trim())
            .eq('password', hashedPassword)
            .eq('status', 'active') // Or 'Aktif' depending on your data
            .single();

          if (error || !user) {
            console.error('Login error:', error);
            return false;
          }

          // Update last_login timestamp (commented out as column doesn't exist)
          // await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);

          set({ 
            isAuthenticated: true, 
            currentUser: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isActive: true,
              createdAt: user.created_at || new Date().toISOString()
            } 
          });
          return true;
        } catch (err) {
          console.error('Unexpected login error:', err);
          return false;
        }
      },
      logout: () => set({ isAuthenticated: false, currentUser: null }),

      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Customers
      customers: [],
      addCustomer: (data) => {
        const newCustomer: Customer = {
          ...data,
          id: generateId(),
          joinedAt: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0,
        };
        set((state) => ({ customers: [newCustomer, ...state.customers] }));
        
        // Sync to Supabase
        supabase.from('customers').insert({
          id: newCustomer.id,
          name: newCustomer.name,
          whatsapp: newCustomer.whatsapp,
          address: newCustomer.address,
          joined_at: newCustomer.joinedAt,
          total_orders: newCustomer.totalOrders,
          total_spent: newCustomer.totalSpent
        }).then(({ error }) => { if (error) console.error('Supabase Error:', error); });
        
        return newCustomer;
      },
      updateCustomer: (id, data) => {
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
        const updatePayload: any = {};
        if (data.name) updatePayload.name = data.name;
        if (data.whatsapp) updatePayload.whatsapp = data.whatsapp;
        if (data.address !== undefined) updatePayload.address = data.address;
        if (data.totalOrders !== undefined) updatePayload.total_orders = data.totalOrders;
        if (data.totalSpent !== undefined) updatePayload.total_spent = data.totalSpent;
        if (Object.keys(updatePayload).length > 0) {
          supabase.from('customers').update(updatePayload).eq('id', id)
            .then(({ error }) => { if (error) console.error('Supabase Error (updateCustomer):', error); });
        }
      },
      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
        supabase.from('customers').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('Supabase Error (deleteCustomer):', error); });
      },

      // Services
      services: [],
      addService: (data) => {
        const newService = { ...data, id: generateId() };
        set((state) => ({
          services: [newService, ...state.services],
        }));
        supabase.from('services').insert({
          id: newService.id,
          name: newService.name,
          price: newService.price,
          estimation_days: newService.estimationDays,
          description: newService.description,
          is_active: newService.isActive,
          icon: newService.icon
        }).then(({ error }) => { if (error) console.error('Supabase Error (addService):', error); });
      },
      updateService: (id, data) => {
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...data } : s)),
        }));
        const updatePayload: any = {};
        if (data.name) updatePayload.name = data.name;
        if (data.price !== undefined) updatePayload.price = data.price;
        if (data.estimationDays !== undefined) updatePayload.estimation_days = data.estimationDays;
        if (data.description !== undefined) updatePayload.description = data.description;
        if (data.isActive !== undefined) updatePayload.is_active = data.isActive;
        if (data.icon !== undefined) updatePayload.icon = data.icon;
        if (Object.keys(updatePayload).length > 0) {
          supabase.from('services').update(updatePayload).eq('id', id)
            .then(({ error }) => { if (error) console.error('Supabase Error (updateService):', error); });
        }
      },
      deleteService: (id) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        }));
        supabase.from('services').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('Supabase Error (deleteService):', error); });
      },

      // Orders
      orders: [],
      addOrder: (data) => {
        const now = new Date().toISOString();
        const newOrder: Order = {
          ...data,
          id: generateId(),
          invoiceNumber: generateInvoiceNumber(),
          statusHistory: [{ status: data.orderStatus, timestamp: now }],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        
        // Sync to Supabase
        supabase.from('orders').insert({
          id: newOrder.id,
          invoice_number: newOrder.invoiceNumber,
          customer_id: newOrder.customerId,
          customer_name: newOrder.customerName,
          customer_whatsapp: newOrder.customerWhatsapp,
          customer_address: newOrder.customerAddress,
          shoe_type: newOrder.shoeType,
          brand: newOrder.brand,
          color: newOrder.color,
          size: newOrder.size,
          condition: newOrder.condition,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          tax: newOrder.tax,
          total: newOrder.total,
          amount_paid: newOrder.amountPaid,
          remaining: newOrder.remaining,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.orderStatus,
          status_history: newOrder.statusHistory,
          order_date: newOrder.orderDate,
          estimated_date: newOrder.estimatedDate,
          created_at: newOrder.createdAt,
          updated_at: newOrder.updatedAt
        }).then(({ error }) => { if (error) console.error('Supabase Error (addOrder):', error); });

        return newOrder;
      },
      updateOrder: (id, data) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString() } : o
          ),
        }));

        // Sync to Supabase
        const updatedFields: any = { updated_at: new Date().toISOString() };
        if (data.invoiceNumber) updatedFields.invoice_number = data.invoiceNumber;
        if (data.customerName) updatedFields.customer_name = data.customerName;
        if (data.customerWhatsapp) updatedFields.customer_whatsapp = data.customerWhatsapp;
        if (data.customerAddress !== undefined) updatedFields.customer_address = data.customerAddress;
        if (data.shoeType) updatedFields.shoe_type = data.shoeType;
        if (data.brand) updatedFields.brand = data.brand;
        if (data.color) updatedFields.color = data.color;
        if (data.size !== undefined) updatedFields.size = data.size;
        if (data.condition !== undefined) updatedFields.condition = data.condition;
        if (data.items !== undefined) updatedFields.items = data.items;
        if (data.subtotal !== undefined) updatedFields.subtotal = data.subtotal;
        if (data.discount !== undefined) updatedFields.discount = data.discount;
        if (data.tax !== undefined) updatedFields.tax = data.tax;
        if (data.total !== undefined) updatedFields.total = data.total;
        if (data.orderStatus) updatedFields.order_status = data.orderStatus;
        if (data.paymentStatus) updatedFields.payment_status = data.paymentStatus;
        if (data.paymentMethod) updatedFields.payment_method = data.paymentMethod;
        if (data.amountPaid !== undefined) updatedFields.amount_paid = data.amountPaid;
        if (data.remaining !== undefined) updatedFields.remaining = data.remaining;
        
        supabase.from('orders').update(updatedFields).eq('id', id)
          .then(({ error }) => { if (error) console.error('Supabase Error (updateOrder):', JSON.stringify(error, null, 2)); });
      },
      updateOrderStatus: (id, status, note) => {
        const currentOrders = get().orders;
        const targetOrder = currentOrders.find((o) => o.id === id);
        if (!targetOrder) {
          console.warn('updateOrderStatus: Order not found for id:', id);
          return;
        }

        const now = new Date().toISOString();
        const isCompleted = ['selesai', 'sudah_diambil'].includes(status);

        const updatedOrder: Order = {
          ...targetOrder,
          orderStatus: status,
          statusHistory: [
            ...targetOrder.statusHistory,
            { status, timestamp: now, note },
          ],
          completedDate: isCompleted ? now : targetOrder.completedDate,
          updatedAt: now,
        };

        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        }));

        // Sync to Supabase - build payload carefully, avoid undefined values
        const updatePayload: Record<string, any> = {
          order_status: status,
          status_history: updatedOrder.statusHistory,
          updated_at: now,
        };
        if (isCompleted) {
          updatePayload.completed_date = now;
        }

        supabase.from('orders').update(updatePayload).eq('id', id).select()
          .then(({ error, data }) => {
            if (error) {
              // If completed_date column doesn't exist, retry without it
              if (isCompleted && error.message?.includes('completed_date')) {
                const { completed_date, ...fallbackPayload } = updatePayload;
                supabase.from('orders').update(fallbackPayload).eq('id', id)
                  .then(({ error: retryError }) => {
                    if (retryError) console.error('Supabase Error (updateOrderStatus retry):', JSON.stringify(retryError));
                    else console.log('Supabase: Order status updated to', status, '(without completed_date)');
                  });
              } else {
                console.error('Supabase Error (updateOrderStatus):', JSON.stringify(error));
              }
            } else {
              console.log('Supabase: Order status updated to', status, 'for', id);
            }
          });
      },
      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        }));
        supabase.from('orders').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('Supabase Error (deleteOrder):', error); });
      },

      // Payments
      payments: [],
      addPayment: (data) => {
        const newPayment = { ...data, id: generateId() };
        set((state) => ({ payments: [newPayment, ...state.payments] }));
        
        // Sync to Supabase
        const payload: Record<string, any> = {
          id: newPayment.id,
          order_id: newPayment.orderId,
          invoice_number: newPayment.invoiceNumber,
          customer_name: newPayment.customerName,
          amount: newPayment.amount,
          method: newPayment.method,
          status: newPayment.status,
          date: newPayment.date,
        };
        if (newPayment.note) payload.note = newPayment.note;

        supabase.from('payments').insert(payload).then(({ error }) => { 
          if (error) {
            // If the error is about a missing note column, retry without note
            if (error.message && error.message.includes('note')) {
              delete payload.note;
              supabase.from('payments').insert(payload).then(({ error: retryError }) => {
                if (retryError) console.error('Supabase Error (addPayment retry):', retryError);
              });
            } else {
              console.error('Supabase Error (addPayment):', JSON.stringify(error, null, 2)); 
            }
          }
        });
      },
      updatePayment: (id, data) => {
        set((state) => ({
          payments: state.payments.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
        
        const updatePayload: Record<string, any> = {};
        if (data.amount !== undefined) updatePayload.amount = data.amount;
        if (data.method !== undefined) updatePayload.method = data.method;
        if (data.status !== undefined) updatePayload.status = data.status;
        if (data.date !== undefined) updatePayload.date = data.date;
        if (data.note !== undefined) updatePayload.note = data.note;

        supabase.from('payments').update(updatePayload).eq('id', id)
          .then(({ error }) => { 
            if (error) {
              if (error.message && error.message.includes('note')) {
                delete updatePayload.note;
                supabase.from('payments').update(updatePayload).eq('id', id).then(({ error: retryError }) => {
                  if (retryError) console.error('Supabase Error (updatePayment retry):', retryError);
                });
              } else {
                console.error('Supabase Error (updatePayment):', JSON.stringify(error, null, 2)); 
              }
            }
          });
      },
      deletePayment: (id) => {
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== id),
        }));
        supabase.from('payments').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('Supabase Error (deletePayment):', error); });
      },

      // Expenses
      expenses: [],
      addExpense: (data) => {
        const newExpense = { ...data, id: generateId() };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
        supabase.from('expenses').insert({
          id: newExpense.id,
          name: newExpense.name,
          amount: newExpense.amount,
          category: newExpense.category,
          date: newExpense.date,
          note: newExpense.note || '',
        }).then(({ error }) => { if (error) console.error('Supabase Error (addExpense):', JSON.stringify(error, null, 2)); });
      },
      updateExpense: (id, data) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
        }));
        const updatePayload: Record<string, any> = {};
        if (data.name) updatePayload.name = data.name;
        if (data.amount !== undefined) updatePayload.amount = data.amount;
        if (data.category) updatePayload.category = data.category;
        if (data.date) updatePayload.date = data.date;
        if (data.note !== undefined) updatePayload.note = data.note;
        supabase.from('expenses').update(updatePayload).eq('id', id)
          .then(({ error }) => { if (error) console.error('Supabase Error (updateExpense):', JSON.stringify(error, null, 2)); });
      },
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
        supabase.from('expenses').delete().eq('id', id)
          .then(({ error }) => { if (error) console.error('Supabase Error (deleteExpense):', JSON.stringify(error, null, 2)); });
      },

      // Users
      // Users
      users: [],
      addUser: async (data, password) => {
        const id = generateId();
        const createdAt = new Date().toISOString();
        const newUser = { ...data, id, createdAt };
        
        set((state) => ({ users: [newUser, ...state.users] }));
        
        try {
          let hashedPassword = 'admin123';
          if (password) {
            const { hashPassword } = await import('@/lib/utils/format');
            hashedPassword = await hashPassword(password);
          }
          
          await supabase.from('users').insert({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.isActive ? 'active' : 'inactive',
            created_at: newUser.createdAt,
            password: hashedPassword
          });
        } catch (error) {
          console.error('Supabase Error (addUser):', JSON.stringify(error, null, 2));
        }
      },
      updateUser: async (id, data, newPassword) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        }));
        
        try {
          const updatePayload: Record<string, any> = {};
          if (data.name) updatePayload.name = data.name;
          if (data.email) updatePayload.email = data.email;
          if (data.role) updatePayload.role = data.role;
          if (data.isActive !== undefined) updatePayload.status = data.isActive ? 'active' : 'inactive';
          
          if (newPassword) {
            const { hashPassword } = await import('@/lib/utils/format');
            updatePayload.password = await hashPassword(newPassword);
          }
          
          if (Object.keys(updatePayload).length > 0) {
            await supabase.from('users').update(updatePayload).eq('id', id);
          }
        } catch (error) {
          console.error('Supabase Error (updateUser):', error);
        }
      },
      deleteUser: async (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        }));
        
        try {
          await supabase.from('users').delete().eq('id', id);
        } catch (error) {
          console.error('Supabase Error (deleteUser):', error);
        }
      },

      // Settings
      settings: defaultSettings,
      updateSettings: (data) => {
        set((state) => ({
          settings: { ...state.settings, ...data },
        }));
        
        // Sync to Supabase
        const updatedFields: any = {};
        if (data.businessName !== undefined) updatedFields.business_name = data.businessName;
        if (data.logo !== undefined) updatedFields.logo = data.logo;
        if (data.address !== undefined) updatedFields.address = data.address;
        if (data.whatsapp !== undefined) updatedFields.whatsapp = data.whatsapp;
        if (data.invoiceFooter !== undefined) updatedFields.invoice_footer = data.invoiceFooter;
        if (data.operatingHours !== undefined) updatedFields.operating_hours = data.operatingHours;
        if (data.invoicePrefix !== undefined) updatedFields.invoice_prefix = data.invoicePrefix;
        if (data.taxRate !== undefined) updatedFields.tax_rate = data.taxRate;
        
        // We only have 1 row for settings in this design. We can update without eq if we only have 1 row, but it's safer to use the one from state or fetch it.
        // For simplicity, update all rows in settings table (since there's only 1).
        if (Object.keys(updatedFields).length > 0) {
          supabase.from('settings').update(updatedFields).neq('id', '00000000-0000-0000-0000-000000000000')
            .then(({ error }) => { if (error) console.error('Supabase Error (updateSettings):', error); });
        }
      },
    }),
    {
      name: 'cucci-malang-pos-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        sidebarCollapsed: state.sidebarCollapsed,
        settings: state.settings,
      }),
    }
  )
);
