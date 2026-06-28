import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

// GET one product
export async function GET(request, { params }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    id: data.id,
    name: data.name,
    sku: data.sku,
    description: data.description,
    category: data.category,
    costPrice: data.cost_price,
    sellPrice: data.sell_price,
    stock: data.stock,
    minStock: data.min_stock,
  })
}

// PATCH - update a product
export async function PATCH(request, { params }) {
  const { id } = await params
  const body = await request.json()

  const updates = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.sku !== undefined) updates.sku = body.sku
  if (body.description !== undefined) updates.description = body.description
  if (body.category !== undefined) updates.category = body.category
  if (body.costPrice !== undefined) updates.cost_price = body.costPrice
  if (body.sellPrice !== undefined) updates.sell_price = body.sellPrice
  if (body.stock !== undefined) updates.stock = body.stock
  if (body.minStock !== undefined) updates.min_stock = body.minStock

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
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
  })
}

// DELETE a product
export async function DELETE(request, { params }) {
  const { id } = await params

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}