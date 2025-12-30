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
        submodel: '1.2 PureTech Allure Pack', // Novo
        segment: 'SUV Compacto',              // Novo
        year: 2023,
        price: 20000,
        fuelType: 'Gasolina',
        km: 15000,
        transmission: 'Manual',               // Novo
        power: 130,                           // Novo (cv)
        engineSize: 1199,                     // Novo (cm3)
        condition: 'Seminovo',                // Novo
        warranty: '24 Meses Marca',           // Novo
        images: ['/peugeot2008.webp'],
        description: 'Peugeot 2008 em excelente estado, com poucos quilómetros e manutenção sempre feita na marca. Versão Allure com cockpit digital 3D.',
        isFeatured: true
      },
      {
        brand: 'Mercedes-Benz',
        model: 'Classe A',
        submodel: 'A 180 d AMG Line',         // Novo
        segment: 'Hatchback Premium',         // Novo
        year: 2023,
        price: 35000,
        fuelType: 'Diesel',
        km: 25000,
        transmission: 'Automática',           // Novo
        power: 116,                           // Novo
        engineSize: 1950,                     // Novo
        condition: 'Usado',                   // Novo
        warranty: '36 Meses Certified',       // Novo
        images: ['/mercedes.jpg'],
        description: 'Mercedes-Benz Classe A com extras premium, teto solar panorâmico, sistema MBUX avançado e sistema de som Harman Kardon.',
        isFeatured: true
      },
      {
        brand: 'Renault',
        model: 'Clio',
        submodel: '1.0 TCe Techno',           // Novo
        segment: 'Utilitário',                // Novo
        year: 2022,
        price: 15000,
        fuelType: 'Gasolina',
        km: 30000,
        transmission: 'Manual',               // Novo
        power: 90,                            // Novo
        engineSize: 999,                      // Novo
        condition: 'Usado',                   // Novo
        warranty: '18 Meses Mútuo',           // Novo
        images: ['/clio.webp'],
        description: 'Renault Clio bem conservado, ideal para cidade com consumo reduzido. Equipado com sensores de estacionamento e Ecrã EasyLink.',
        isFeatured: true
      },
      {
        brand: 'Dacia',
        model: 'Sandero',
        submodel: 'Stepway Extreme Eco-G',    // Novo
        segment: 'Crossover',                 // Novo
        year: 2024,
        price: 16000,
        fuelType: 'GPL',
        km: 14000,
        transmission: 'Manual',               // Novo
        power: 100,                           // Novo
        engineSize: 999,                      // Novo
        condition: 'Seminovo',                // Novo
        warranty: '3 Anos Fábrica',           // Novo
        images: ['/dacia.webp'],
        description: 'Dacia Sandero Stepway versão topo de gama. Tecnologia Bi-Fuel (Gasolina/GPL) para máxima poupança. Barras de tejadilho modulares.',
        isFeatured: true
      },
      {
        brand: 'Tesla',
        model: 'Model 3',
        submodel: 'Long Range AWD',           // Novo
        segment: 'Sedan Elétrico',            // Novo
        year: 2021,
        price: 32000,
        fuelType: 'Elétrico',
        km: 50000,
        transmission: 'Automática',           // Novo
        power: 440,                           // Novo (Combinado aprox.)
        engineSize: 0,                        // Novo (Elétrico = 0)
        condition: 'Usado',                   // Novo
        warranty: 'Garantia Baterias e Motores', // Novo
        images: ['/tesla.webp'],
        description: 'Tesla Model 3 Long Range, tração integral. Autopilot incluído, interior premium preto e autonomia real superior a 500 km.',
        isFeatured: true
      },
      {
        brand: 'BMW',
        model: 'Série 1',
        submodel: '118i Pack M',              // Novo
        segment: 'Hatchback Premium',         // Novo
        year: 2018,
        price: 19500,
        fuelType: 'Gasolina',
        km: 77000,
        transmission: 'Manual',               // Novo
        power: 136,                           // Novo
        engineSize: 1499,                     // Novo
        condition: 'Usado',                   // Novo
        warranty: '12 Meses Stand',           // Novo
        images: ['/bmw.jpg'],
        description: 'BMW Série 1 desportivo com Pack M interior e exterior. Volante desportivo em pele, faróis LED e suspensão desportiva.',
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