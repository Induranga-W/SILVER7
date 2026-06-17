import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// GET one product
export async function GET(request, { params }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH - update a product
export async function PATCH(request, { params }) {
  const { id } = await params
  const body = await request.json()

  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
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