import supabase from '@/lib/SupaConnection'

import { NextResponse } from 'next/server'

export async function GET() {
  const { data: Entry, error } = await supabase
    .from('Entry')
    .select('id,desc')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({
      success: false,
      status: error.code,
      message: error.message,
    })
  }

  return NextResponse.json({
    success: true,
    status: 200,
    data: { entries: Entry },
  })
}

export async function POST(req: Request) {
  const { desc, id } = await new Response(req.body).json()

  const { data, error } = await supabase
    .from('Entry')
    .insert([{ desc, id }])
    .select('id,desc')

  if (error) {
    console.log(error.message)

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    )
  }

  // test
  /*   await new Promise((resolve) => setTimeout(resolve, 3000)) */

  return NextResponse.json({ success: true, data }, { status: 201 })
}
