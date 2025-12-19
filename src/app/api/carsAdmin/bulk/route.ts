import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../app/auth"; 

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  try {
    const body = await req.json(); 
    
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: "O formato deve ser uma lista (array) de carros." }, { status: 400 });
    }

    // Mapeamos o array para garantir que os tipos correspondem ao Schema
    const carsToImport = body.map((car: any) => ({
      brand: String(car.brand),
      model: String(car.model),
      year: parseInt(car.year),       // Força Int
      price: parseFloat(car.price),   // Força Float
      fuelType: String(car.fuelType),
      km: parseInt(car.km),           // Força Int
      
      // Garante que images é sempre um array de strings.
      // Se o JSON trouxer apenas uma string "img.jpg", converte para ["img.jpg"]
      images: Array.isArray(car.images) ? car.images : (car.images ? [String(car.images)] : []),
      
      description: car.description ? String(car.description) : null,
      isAvailable: true
    }));

    // createMany é muito mais rápido para grandes volumes
    const result = await prisma.car.createMany({
      data: carsToImport,
      skipDuplicates: true, // Opcional: ignora se houver IDs duplicados (se os enviasses)
    });

    return NextResponse.json({ 
      message: `Sucesso! ${result.count} carros importados.`,
      count: result.count 
    }, { status: 201 });

  } catch (error) {
    console.error("Erro na importação massiva:", error);
    return NextResponse.json({ message: "Erro ao importar dados. Verifica o formato do JSON." }, { status: 500 });
  }
}