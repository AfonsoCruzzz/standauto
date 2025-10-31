import Link from 'next/link'

interface Car {
  id: string
  brand: string
  model: string
  year: number
  price: number
  fuelType: string
  km: number
  images: string[]
}

interface CarCardProps {
  car: Car
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Link href={`/cars/${car.id}`}>
      <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {car.images && car.images.length > 0 ? (
            <img 
              src={car.images[0]} 
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-500">Sem imagem</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">
            {car.brand} {car.model}
          </h3>
          <p className="text-gray-600 mb-2">
            {car.year} • {car.km.toLocaleString()} km • {car.fuelType}
          </p>
          <p className="text-2xl font-bold text-blue-600">
            {car.price.toLocaleString('pt-PT')} €
          </p>
        </div>
      </div>
    </Link>
  )
}