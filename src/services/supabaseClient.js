import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL =
import.meta.env.VITE_SUPABASE_URL || "https://anovwnwddqlhljkymrvw.supabase.co"

const SUPABASE_ANON_KEY =
import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub3Z3bndkZHFsaGxqa3ltcnZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MTgxNDEsImV4cCI6MjA5ODk5NDE0MX0.Jk_3kyFyF0jog3Lx7q709LvrAkBDt0mbHZDe7TEgXgY"

export const supabase = createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
)
