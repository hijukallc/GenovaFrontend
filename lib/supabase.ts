import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://uwexrnjjodgsrvxrmqbn.supabase.co';
const supabaseKey = 'sb_publishable_zvRNhsNeux38bnMP6ALRHQ_IY-tAbP5';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };