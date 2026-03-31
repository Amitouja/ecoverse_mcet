import { supabase } from '@/src/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { data, error } = await supabase
      .from('footprints')
      .insert([
        {
          user_id: 'anonymous',
          type: 'travel',
          carbon_footprint: body.carbon,
          details: JSON.stringify({
            travel_type: body.type,
            distance: body.distance,
            passengers: body.passengers
          })
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
