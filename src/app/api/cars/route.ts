import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const brand = searchParams.get("brand");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const featured = searchParams.get("featured");

  // Construir o filtro dinamicamente
  const whereClause: any = {
    isAvailable: true, // Só mostra carros disponíveis
  };

  // 1. Filtro de Marca (Só adiciona se tiver texto escrito)
  if (brand && brand.trim() !== "") {
    whereClause.brand = { contains: brand, mode: "insensitive" };
  }

  // 2. Filtro de Preço (Lógica "Blindada")
  // Verifica se existe filtro de preço OU min OU max
  if (minPrice || maxPrice) {
    whereClause.price = {};
    
    // Só adiciona se for um número válido
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      whereClause.price.gte = parseFloat(minPrice); // gte = Greater Than or Equal (Maior ou igual)
    }
    
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      whereClause.price.lte = parseFloat(maxPrice); // lte = Less Than or Equal (Menor ou igual)
    }
  }

  // 3. Filtro de Destaque (Homepage)
  if (featured === "true") {
    whereClause.isFeatured = true;
  }

  try {
    const cars = await prisma.car.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    // IMPORTANTE: Adicionar headers para impedir cache nesta rota de API
    return NextResponse.json(cars, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Erro na API cars:", error);
    return NextResponse.json({ message: "Erro ao buscar carros" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const car = await prisma.car.create({
      data: body
    })
    return NextResponse.json(car)
  } catch (error) {
    console.error('Error creating car:', error)
    return NextResponse.json(
      { error: 'Error creating car' },
      { status: 500 }
    )
  }
}