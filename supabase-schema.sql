-- ==========================================
-- Supabase SQL Editor Script for Cucci Malang
-- ==========================================

-- Enable pgcrypto for UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0
);

-- 2. Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  estimation_days INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  icon TEXT
);

-- 3. Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  shoe_type TEXT NOT NULL,
  brand TEXT NOT NULL,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  condition TEXT NOT NULL,
  photo_before TEXT,
  photo_after TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of items
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  tax NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  remaining NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  order_status TEXT NOT NULL,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estimated_date TIMESTAMPTZ NOT NULL,
  completed_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  invoice_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

-- 5. Expenses Table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

-- 6. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- Hashed password stored here
  role TEXT NOT NULL DEFAULT 'kasir',
  avatar TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Settings Table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  logo TEXT,
  address TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  invoice_footer TEXT NOT NULL,
  operating_hours TEXT NOT NULL,
  invoice_prefix TEXT NOT NULL,
  tax_rate NUMERIC NOT NULL DEFAULT 0
);

-- Insert Default Settings
INSERT INTO settings (business_name, address, whatsapp, invoice_footer, operating_hours, invoice_prefix, tax_rate)
VALUES (
  'Cucci Malang',
  'Jl. Sudirman No. 123, Malang',
  '081234567890',
  'Terima kasih telah mencuci sepatu di Cucci Malang! Harap diambil dalam 30 hari.',
  'Senin - Minggu: 08:00 - 20:00',
  'INV',
  0
);

-- Default Admin User (Password: admin123)
-- The password hash here should match the hash mechanism you use in your app. 
-- In our app we use SHA-256 for simple hashing. The sha256 of 'admin123' is:
-- 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
INSERT INTO users (name, email, password, role)
VALUES ('Admin Cucci Malang', 'admin@cuccimalang.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin');

-- Default Kasir User (Password: kasir123)
-- The sha256 of 'kasir123' is: 
-- 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
INSERT INTO users (name, email, password, role)
VALUES ('Kasir Cucci Malang', 'kasir@cuccimalang.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'kasir');

-- Set up Row Level Security (RLS) to be fully public (Since app does its own user validation)
-- Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to customers" ON customers FOR ALL USING (true) WITH CHECK (true);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to services" ON services FOR ALL USING (true) WITH CHECK (true);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to payments" ON payments FOR ALL USING (true) WITH CHECK (true);

-- Expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to expenses" ON expenses FOR ALL USING (true) WITH CHECK (true);

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to users" ON users FOR ALL USING (true) WITH CHECK (true);

-- Settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to settings" ON settings FOR ALL USING (true) WITH CHECK (true);
