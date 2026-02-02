import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  created_at: string
  updated_at: string
}

export type Inquiry = {
  id: string
  product_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  message: string
  status: string
  created_at: string
  updated_at: string
}
