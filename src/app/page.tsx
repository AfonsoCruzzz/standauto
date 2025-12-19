import CarCard from '@/components/CarCard'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import Link from 'next/link'

// Isto é CRÍTICO para funcionar na Vercel
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getCars() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://standauto.vercel.app'
    const res = await fetch(`${baseUrl}/api/cars?featured=true`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) {
      throw new Error(`Failed to fetch cars: ${res.status}`)
    }
    if (!res.ok) {
      // Tratamento de erro simples
      return <div>Erro ao carregar destaques</div>;
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching cars:', error)
    return []
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  const cars = await getCars()
  console.log('Cars loaded:', cars.length) // Para debug

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        {session ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Olá, <strong>{session.user?.name}</strong> ({session.user?.role})</span>
            {session.user?.role === 'ADMIN' && (
              <Link href="/admin/dashboard" className="text-blue-600 hover:underline font-medium">Dashboard</Link>
            )}
            <Link href="/api/auth/signout" className="text-red-600 hover:underline">Sair</Link>
          </div>
        ) : (
          <Link href="/api/auth/signin" className="text-blue-600 font-medium hover:underline">Entrar na Conta</Link>
        )}
      </div>

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