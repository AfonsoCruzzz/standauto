import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Ler todos os parâmetros novos
  const keyword = searchParams.get("keyword"); // Pesquisa texto
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  const maxKm = searchParams.get("maxKm");
  const fuelType = searchParams.get("fuelType");
  const transmission = searchParams.get("transmission");
  const featured = searchParams.get("featured");
  const brand = searchParams.get("brand");
  const model = searchParams.get("model");
  const year = searchParams.get("year");
  const submodel = searchParams.get("submodel");
  const power = searchParams.get("power");
  const engineSize = searchParams.get("engineSize");
  const condition = searchParams.get("condition");
  const warranty = searchParams.get("warranty");

  const segment = searchParams.get("segment");

  const whereClause: any = {
    isAvailable: true,
  };

  // 1. Pesquisa Inteligente (Marca OU Modelo)
  if (keyword && keyword.trim() !== "") {
    whereClause.OR = [
      { brand: { contains: keyword, mode: "insensitive" } },
      { model: { contains: keyword, mode: "insensitive" } },
    ];
  }

  // 2. Filtro de Preço
  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price.gte = parseFloat(minPrice);
    if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
  }

  // 3. Filtro de Ano (NOVO)
  if (minYear || maxYear) {
    whereClause.year = {};
    if (minYear) whereClause.year.gte = parseInt(minYear);
    if (maxYear) whereClause.year.lte = parseInt(maxYear);
  }

  // 4. Filtro de KM (NOVO)
  if (maxKm) {
    whereClause.km = { lte: parseInt(maxKm) };
  }

  // 5. Combustível e Caixa (NOVO)
  if (fuelType && fuelType !== "") {
    whereClause.fuelType = fuelType;
  }
  
  if (transmission && transmission !== "") {
    whereClause.transmission = transmission;
  }

  // 6. Destaque
  if (featured === "true") {
    whereClause.isFeatured = true;
  }

  if (segment && segment !== "") {
    whereClause.segment = segment;
  }
  
  try {
    const cars = await prisma.car.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cars, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Erro API:", error);
    return NextResponse.json({ message: "Erro ao buscar carros" }, { status: 500 });
  }
}