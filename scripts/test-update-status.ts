import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  // First, get an order
  const { data: orders, error: fetchError } = await supabase.from('orders').select('*').limit(1);
  if (fetchError) {
    console.error('Fetch Error:', fetchError);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log('No orders found to update.');
    return;
  }

  const order = orders[0];
  console.log('Found order:', order.id, 'Current status:', order.order_status);

  // Try updating it
  const { data: updateData, error: updateError } = await supabase.from('orders').update({
    order_status: 'dicuci',
    updated_at: new Date().toISOString()
  }).eq('id', order.id).select();

  if (updateError) {
    console.error('Update Error:', updateError);
  } else {
    console.log('Update Success:', updateData);
  }
}

testUpdate();
