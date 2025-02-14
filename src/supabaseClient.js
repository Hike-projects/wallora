import { createClient } from '@supabase/supabase-js';

// Project URL and Secret Key from your Supabase project
const supabaseUrl = 'https://rptdmaistscgifwhnkzg.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdGRtYWlzdHNjZ2lmd2hua3pnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTUwNTgzMCwiZXhwIjoyMDU1MDgxODMwfQ.cOhB6k7TkGbV8zX6vHXVMSHv1FePaFY1v1uDC0ykFK4';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
