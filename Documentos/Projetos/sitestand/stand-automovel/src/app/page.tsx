import CarCard from '@/components/CarCard'

async function getCars() {
  try {
    const res = await fetch('http://localhost:3000/api/cars', {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch cars')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching cars:', error)
    return []
  }
}

export default async function Home() {
  const cars = await getCars()

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