import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/auth"; // Ajusta o caminho para o teu authOptions

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  // Apenas ADMIN pode criar
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  try {
    const body = await req.json();
    
    // Validação básica
    if (!body.brand || !body.model || !body.price) {
      return NextResponse.json({ message: "Faltam campos obrigatórios" }, { status: 400 });
    }

    const car = await prisma.car.create({
      data: {
        brand: body.brand,
        model: body.model,
        // Conversão forçada de String para Número para bater certo com o Schema
        year: parseInt(body.year),       // Schema: Int
        price: parseFloat(body.price),   // Schema: Float
        fuelType: body.fuelType,
        km: parseInt(body.km),           // Schema: Int
        
        // O Schema pede String[] (Array). 
        // O frontend envia um array, mas por segurança garantimos aqui:
        images: Array.isArray(body.images) ? body.images : [], 
        
        description: body.description || null, // Schema: String? (Opcional)
        isAvailable: true
      }
    });

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar carro:", error);
    return NextResponse.json({ message: "Erro ao processar dados" }, { status: 500 });
  }
}