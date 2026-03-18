import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { tasks: true }
  })
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const body = await req.json()
  const project = await prisma.project.create({ data: body })
  return NextResponse.json(project, { status: 201 })
}