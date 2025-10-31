import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
  await prisma.car.deleteMany()

  // Adicionar carros de exemplo
  await prisma.car.createMany({
    data: [
      {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        price: 25000,
        fuelType: 'Gasolina',
        km: 15000,
        images: ['/cars/toyota-corolla.jpg'],
        description: 'Toyota Corolla em excelente estado, com poucos quilómetros e manutenção sempre feita na marca.'
      },
      {
        brand: 'BMW',
        model: 'Série 3',
        year: 2021,
        price: 35000,
        fuelType: 'Diesel',
        km: 25000,
        images: ['/cars/bmw-serie3.jpg'],
        description: 'BMW Série 3 com extras premium, teto solar e sistema de som Harman Kardon.'
      },
      {
        brand: 'Volkswagen',
        model: 'Golf',
        year: 2020,
        price: 22000,
        fuelType: 'Gasolina',
        km: 40000,
        images: ['/cars/vw-golf.jpg'],
        description: 'Volkswagen Golf bem conservado, ideal para cidade com consumo reduzido.'
      },
      {
        brand: 'Mercedes',
        model: 'Classe A',
        year: 2023,
        price: 38000,
        fuelType: 'Híbrido',
        km: 5000,
        images: ['/cars/mercedes-classea.jpg'],
        description: 'Mercedes Classe A quase novo, tecnologia de ponta e conforto excecional.'
      },
      {
        brand: 'Audi',
        model: 'A4',
        year: 2021,
        price: 32000,
        fuelType: 'Diesel',
        km: 30000,
        images: ['/cars/audi-a4.jpg'],
        description: 'Audi A4 Avant, espaço amplo e desempenho excelente para viagens longas.'
      },
      {
        brand: 'Ford',
        model: 'Focus',
        year: 2022,
        price: 19500,
        fuelType: 'Gasolina',
        km: 20000,
        images: ['/cars/ford-focus.jpg'],
        description: 'Ford Focus com ótimo custo-benefício, económico e fiável.'
      }
    ],
  })

  console.log('✅ Dados de exemplo adicionados com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })