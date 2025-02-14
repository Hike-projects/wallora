import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase Project URL and Public Anon Key
const SUPABASE_URL = 'https://rptdmaistscgifwhnkzg.supabase.co'; // Your Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInT5cCI6IkpXVCJ9......'; // Your anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
