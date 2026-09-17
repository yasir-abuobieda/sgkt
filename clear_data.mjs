import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbuwholimvztpevvwyur.supabase.co';
const supabaseAnonKey = 'sb_publishable_ybuo5K5TwA28n7FZhle3rQ__SYe0SWr';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearData() {
  console.log('Clearing test data...');
  
  // Delete all news
  const { error: newsError } = await supabase.from('news').delete().neq('id', 0);
  if (newsError) console.error('Error deleting news:', newsError.message);
  else console.log('News deleted successfully.');

  // Delete all events
  const { error: eventsError } = await supabase.from('events').delete().neq('id', 0);
  if (eventsError) console.error('Error deleting events:', eventsError.message);
  else console.log('Events deleted successfully.');

  // Delete all executive_office members
  const { error: teamError } = await supabase.from('executive_office').delete().neq('id', 0);
  if (teamError) console.error('Error deleting executive_office:', teamError.message);
  else console.log('Executive office members deleted successfully.');

  // Delete all registrations (optional, but good practice since events are deleted)
  const { error: regError } = await supabase.from('registrations').delete().neq('id', 0);
  if (regError) console.error('Error deleting registrations:', regError.message);
  else console.log('Registrations deleted successfully.');
  
  // Delete all contacts
  const { error: contactError } = await supabase.from('contacts').delete().neq('id', 0);
  if (contactError) console.error('Error deleting contacts:', contactError.message);
  else console.log('Contacts deleted successfully.');

  console.log('Done!');
}

clearData();
