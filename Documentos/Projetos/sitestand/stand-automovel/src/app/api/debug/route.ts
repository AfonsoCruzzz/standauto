import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET() {
  try {
    // Testar conexão básica
    await prisma.$queryRaw`SELECT 1`
    
    // Contar carros
    const carCount = await prisma.car.count()
    
    // Buscar alguns carros
    const cars = await prisma.car.findMany({ take: 2 })
    
    return NextResponse.json({
      status: 'success',
      database: 'connected',
      carCount,
      sampleCars: cars,
      environment: process.env.NODE_ENV
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}