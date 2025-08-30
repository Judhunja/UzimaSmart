import { createClient } from '@supabase/supabase-js'

// Supabase configuration with fallback values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmcmxqbzqsudvqxutpuf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtY214cWJ6cXN1ZHZxeHV0cHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NzUwMDgsImV4cCI6MjA3MTI1MTAwOH0.LhwNoejaSxBNO3Z846FipckgO1ZmxILtTqabDahF7qc'

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these with Supabase CLI)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      counties: {
        Row: {
          id: number
          name: string
          code: string
          capital: string | null
          population: number | null
          area_km2: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          code: string
          capital?: string | null
          population?: number | null
          area_km2?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
          capital?: string | null
          population?: number | null
          area_km2?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      climate_data: {
        Row: {
          id: string
          county_id: number
          date: string
          ndvi_mean: number | null
          ndvi_std: number | null
          temperature_mean: number | null
          temperature_max: number | null
          temperature_min: number | null
          rainfall: number | null
          humidity: number | null
          wind_speed: number | null
          solar_radiation: number | null
          data_source: string | null
          confidence_level: number | null
          created_at: string
        }
        Insert: {
          id?: string
          county_id: number
          date: string
          ndvi_mean?: number | null
          ndvi_std?: number | null
          temperature_mean?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          rainfall?: number | null
          humidity?: number | null
          wind_speed?: number | null
          solar_radiation?: number | null
          data_source?: string | null
          confidence_level?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          county_id?: number
          date?: string
          ndvi_mean?: number | null
          ndvi_std?: number | null
          temperature_mean?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
          rainfall?: number | null
          humidity?: number | null
          wind_speed?: number | null
          solar_radiation?: number | null
          data_source?: string | null
          confidence_level?: number | null
          created_at?: string
        }
      }
    }
  }
}
