import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Limpar dados existentes
  await prisma.car.deleteMany()

  const password = await bcrypt.hash('admin123', 10)
  // Adicionar carros de exemplo
  await prisma.car.createMany({
    data: [
      {
        brand: 'Peugeot',
        model: '2008',
        year: 2023,
        price: 20000,
        fuelType: 'Gasolina',
        km: 15000,
        images: ['/peugeot2008.webp'],
        description: 'Peugeot 2008 em excelente estado, com poucos quilómetros e manutenção sempre feita na marca.',
        isFeatured: true
      },
      {
        brand: 'Mercedes-Benz',
        model: 'Classe A',
        year: 2023,
        price: 35000,
        fuelType: 'Diesel',
        km: 25000,
        images: ['/mercedes.jpg'],
        description: 'Mercedes-Benz Classe A com extras premium, teto solar e sistema de som Harman Kardon.',
        isFeatured: true
      },
      {
        brand: 'Renault',
        model: 'Clio',
        year: 2022,
        price: 15000,
        fuelType: 'Gasolina',
        km: 30000,
        images: ['/clio.webp'],
        description: 'Renault Clio bem conservado, ideal para cidade com consumo reduzido.',
        isFeatured: true
      },
      {
        brand: 'Dacia',
        model: 'Sandero',
        year: 2024,
        price: 16000,
        fuelType: 'GPL',
        km: 14000,
        images: ['/dacia.webp'],
        description: 'Dacia Sandero quase novo, tecnologia de ponta e conforto excecional.',
        isFeatured: true
      },
      {
        brand: 'Tesla',
        model: 'Model 3',
        year: 2021,
        price: 32000,
        fuelType: 'Elétrico',
        km: 50000,
        images: ['/tesla.webp'],
        description: 'Tesla Model 3, espaço amplo e desempenho excelente com autonomia de até 500 km.',
        isFeatured: true
      },
      {
        brand: 'BMW',
        model: 'Série 1',
        year: 2018,
        price: 19500,
        fuelType: 'Gasolina',
        km: 77000,
        images: ['/bmw.jpg'],
        description: 'BMW Série 1 com ótimo custo-benefício, desempenho e fiável.',
        isFeatured: true
      }
    ],
  })

  const admin = await prisma.user.upsert({
    where: { email: 'admin@stand.com' },
    update: {},
    create: {
      email: 'admin@stand.com',
      name: 'Super Admin',
      password,
      role: 'ADMIN',
    },
  })

  console.log({ admin })

  console.log('✅ Dados de exemplo adicionados com sucesso!')
}

main()
  .catch(async (e) => {
    console.error('Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })