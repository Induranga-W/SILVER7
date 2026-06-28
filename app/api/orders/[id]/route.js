import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('orders')
    .select(`*, customers (id, name, email), order_items (*, products (name, sell_price))`)
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}