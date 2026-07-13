import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
  const { data: orders, error: fetchError } = await supabase.from('orders').select('*').limit(1);
  if (!orders || orders.length === 0) return;

  const order = orders[0];
  console.log('Found order:', order.id, 'Current status:', order.order_status);

  // Exact payload as updateOrderStatus
  const payload = {
    order_status: 'pengeringan',
    status_history: [
      { status: 'baru', timestamp: new Date().toISOString() },
      { status: 'pengeringan', timestamp: new Date().toISOString(), note: 'test' }
    ],
    completed_date: undefined,
    updated_at: new Date().toISOString()
  };

  const { data: updateData, error: updateError } = await supabase.from('orders').update(payload).eq('id', order.id).select();

  if (updateError) {
    console.error('Update Error:', updateError);
  } else {
    console.log('Update Success. Returned records:', updateData?.length);
    console.log('Order status is now:', updateData?.[0]?.order_status);
  }
}

testUpdate();
