import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

// GET all products
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const mapped = data.map(p => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    category: p.category,
    costPrice: p.cost_price,
    sellPrice: p.sell_price,
    stock: p.stock,
    minStock: p.min_stock,
  }))
  return NextResponse.json(mapped)
}

// POST - create a product
export async function POST(request) {
  const body = await request.json()
  const { name, sku, description, category, costPrice, sellPrice, stock, minStock } = body

  const { data, error } = await supabase
    .from('products')
    .insert([{
      name,
      sku,
      description,
      category,
      cost_price: costPrice,
      sell_price: sellPrice,
      stock,
      min_stock: minStock,
    }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const p = data[0]
  return NextResponse.json({
    id: p.id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    category: p.category,
    costPrice: p.cost_price,
    sellPrice: p.sell_price,
    stock: p.stock,
    minStock: p.min_stock,
  }, { status: 201 })
}
