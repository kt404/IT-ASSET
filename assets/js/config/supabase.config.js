// ===================== SUPABASE CONFIG =====================
// Dán URL và anon key của project Supabase vào đây (Settings > API trong dashboard Supabase)
const SUPABASE_URL = 'https://ravpzhfocqbzmroyhfwf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdnB6aGZvY3Fiem1yb3loZndmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDMwOTIsImV4cCI6MjA5OTA3OTA5Mn0.utLl68zdUMB6hzlfrHb2kyMrh-paV2GTYNChbgS5ULY';
//const SUPABASE_URL = 'https://ravpzhfocqbzmroyhfwf.supabase.co';
//const SUPABASE_ANON_KEY = 'sb_publishable_GYf6BdYokTiceJbBPqw8-A_Gct-v7rv';
let sb = null;
// Chấp nhận cả domain *.supabase.co (cloud) lẫn địa chỉ IP/host nội bộ dạng http:// (self-hosted)
const SUPABASE_CONFIGURED = /^https?:\/\/.+$/.test(SUPABASE_URL) && typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20;
try{ if(SUPABASE_CONFIGURED && window.supabase) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }catch(e){ console.error('Supabase init lỗi:', e); }
