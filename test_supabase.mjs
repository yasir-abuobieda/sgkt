import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbuwholimvztpevvwyur.supabase.co';
const supabaseAnonKey = 'sb_publishable_ybuo5K5TwA28n7FZhle3rQ__SYe0SWr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  try {
    const { data, error } = await supabase.from('events').select('*').limit(1);
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Exception during connection:', err);
  }
}

testConnection();
