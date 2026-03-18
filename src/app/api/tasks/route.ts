import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { project: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  const body = await req.json()
  const task = await prisma.task.create({ data: body })
  return NextResponse.json(task, { status: 201 })
}