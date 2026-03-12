import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://wrvwpqxrmxgbaslkvspr.supabase.co"

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndydndwcXhybXhnYmFzbGt2c3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDk4NzAsImV4cCI6MjA4ODcyNTg3MH0.0TqPgSrdxggNHJIKU-ibQq4lTnPVBfr-IqIa_bc5Y_Q"

export const supabase = createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
)