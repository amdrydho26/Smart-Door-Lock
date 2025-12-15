import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

console.log('Checking environment variables...')
console.log({
  VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
  SUPABASE_URL: !!process.env.SUPABASE_URL,
  SUPABASE_KEY: !!process.env.SUPABASE_KEY,
})

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing Supabase env vars. Create a .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY or set SUPABASE_URL/SUPABASE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

try {
  const { data, error } = await supabase.from('log').select('*').limit(5)
  if (error) {
    console.error('Supabase query error:', error)
    process.exit(1)
  }
  console.log('Fetched rows:', (data || []).length)
  console.log(JSON.stringify(data, null, 2))
} catch (e) {
  console.error('Unexpected error:', e)
  process.exit(1)
}
