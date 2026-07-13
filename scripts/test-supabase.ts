import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local manually for the script
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndSeed() {
  console.log('Checking connection to Supabase...');
  
  // Try to query orders
  const { data: orders, error: fetchError } = await supabase.from('orders').select('invoice_number').limit(5);
  
  if (fetchError) {
    console.error('Failed to connect or read from Supabase. Error:', fetchError.message);
    if (fetchError.message.includes('relation "public.orders" does not exist')) {
      console.log('It looks like the SQL script has not been run yet to create the tables!');
    }
    return;
  }


  if (orders && orders.length === 0) {
    console.log('Orders table is empty.');
  }

  console.log('✅ Supabase connection and tables look good!');
}

checkAndSeed().catch(console.error);
