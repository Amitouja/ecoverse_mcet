import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, user_email, items, total, shipping_address, billing_address } = body;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { success: false, error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    // Use service role key if available (bypasses RLS), otherwise use anon key
    const apiKey = supabaseServiceRoleKey || supabaseAnonKey;
    const supabase = createClient(supabaseUrl, apiKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Calculate eco points (1 point per ₹50)
    const ecoPoints = Math.round(total / 50);

    // Prepare order data
    const orderData: any = {
      items,
      total,
      status: 'pending',
      eco_points_earned: ecoPoints,
    };

    // Add email and addresses
    if (user_email) orderData.user_email = user_email;
    if (shipping_address) orderData.shipping_address = shipping_address;
    if (billing_address) orderData.billing_address = billing_address;
    if (user_id) orderData.user_id = user_id;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', {
        message: orderError.message,
        details: orderError.details,
        hint: orderError.hint,
        code: orderError.code,
      });
      throw orderError;
    }

    // Try to update user eco points if user_id or user_email exists
    if (user_id || user_email) {
      try {
        const { data: user } = await supabase
          .from('users')
          .select('eco_points')
          .eq(user_id ? 'id' : 'email', user_id || user_email)
          .single();

        if (user) {
          const currentPoints = user.eco_points || 0;
          await supabase
            .from('users')
            .update({ eco_points: currentPoints + ecoPoints })
            .eq(user_id ? 'id' : 'email', user_id || user_email);
        }
      } catch (error) {
        console.warn('Could not update user eco points:', error);
        // Don't fail the order if user update fails
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order?.id,
      ecoPointsEarned: ecoPoints,
      message: 'Order saved successfully',
    });
  } catch (error) {
    console.error('Error saving order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

