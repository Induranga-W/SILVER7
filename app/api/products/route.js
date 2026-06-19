import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET all products
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST - create a product
export async function POST(request) {
  const body = await request.json()
  const { name, description, price, stock, category } = body

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, description, price, stock, category }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0], { status: 201 })
}
