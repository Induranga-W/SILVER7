import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

// GET all orders (with customer name joined)
export async function GET() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (id, name, email),
      order_items (*, products (name, price))
    `)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST - create a new order
export async function POST(request) {
  const body = await request.json()
  const { customer_id, items } = body
  // items = [{ product_id, quantity, unit_price }]

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{ customer_id, total, status: 'pending' }])
    .select()

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 })

  // Insert order items
  const orderItems = items.map(item => ({
    ...item,
    order_id: order[0].id
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  return NextResponse.json(order[0], { status: 201 })
}