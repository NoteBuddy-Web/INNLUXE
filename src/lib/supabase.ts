import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rqdhwrtkweeuiqjrvbrd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxZGh3cnRrd2VldWlxanJ2YnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTgxNTYsImV4cCI6MjA3NzIzNDE1Nn0.R_84JD0cRrYjdTd6mU837bfwcBdw9s9a8EEYRHE70uE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface SellFormData {
  id?: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  contact_method: string
  best_time: string
  property_type: string
  surface_area: string
  bedrooms: string
  bathrooms: string
  year_built: string
  condition: string
  features: string
  urgency: string
  desired_price: string
  mortgage: string
  viewing_availability: string
  additional_info: string
  created_at?: string
}

export interface ContactFormData {
  id?: string
  name: string
  email: string
  phone: string
  message: string
  created_at?: string
}

export interface SellFormDraftData {
  id?: string
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  contact_method?: string
  best_time?: string
  property_type?: string
  surface_area?: string
  bedrooms?: string
  bathrooms?: string
  year_built?: string
  condition?: string
  features?: string
  urgency?: string
  desired_price?: string
  mortgage?: string
  viewing_availability?: string
  additional_info?: string
  created_at?: string
  updated_at?: string
}
