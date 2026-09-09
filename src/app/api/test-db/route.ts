import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: events, error: eventsError } = await supabase.from('events').select('id').limit(1);
    
    if (eventsError) return NextResponse.json({ error: 'Failed to fetch events', details: eventsError });
    
    const eventId = events && events.length > 0 ? events[0].id : null;

    const { data, error } = await supabase.from('registrations').insert({
      event_id: eventId,
      event_title: 'Test Event',
      name: 'Test Name',
      phone: '123456789',
      university: 'Test City',
      specialty: 'Test Notes'
    }).select();

    return NextResponse.json({ success: !error, data, error });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
