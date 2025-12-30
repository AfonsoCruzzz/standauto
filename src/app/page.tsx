import CarCard from '@/components/CarCard'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import Link from 'next/link'

// Isto é CRÍTICO para funcionar na Vercel
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Na tua homepage, atualiza a função getCars para:
async function getCars() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://standauto.vercel.app'
    const res = await fetch(`${baseUrl}/api/cars?featured=true`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch cars:', res.status);
      return [];
    }
    if (!res.ok) {
      // Tratamento de erro simples
      return <div>Erro ao carregar destaques</div>;
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  const cars = await getCars()
  console.log('Cars loaded:', cars.length) // Para debug

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Stand Automóvel
        </h1>
        <p className="text-xl text-gray-600">
          Encontre o carro dos seus sonhos
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum carro disponível no momento.</p>
          <p className="text-gray-400 text-sm mt-2">
            <a href="/api/cars" className="text-blue-500 hover:underline">
              Ver API diretamente
            </a>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car: any) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}