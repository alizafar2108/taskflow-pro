import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(
  req: Request,
  context: any
) {
  try {
    const params = await context.params
    const body = await req.json()
    const task = await prisma.task.update({
      where: { id: Number(params.id) },
      data: body
    })
    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: any
) {
  try {
    const params = await context.params
    await prisma.task.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}