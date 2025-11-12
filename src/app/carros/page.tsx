'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CarCard from '../../components/CarCard';
import FilterSidebar from '../../components/FilterSidebar';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuelType: string;
  price: number;
  images: string[];
}

export default function CarrosPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Buscar carros da API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('/api/cars');
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados da API:', data);
        
        // Garantir que data é um array
        if (Array.isArray(data)) {
          setCars(data);
          setFilteredCars(data);
        } else {
          console.error('Dados não são um array:', data);
          setError('Formato de dados inválido');
          setCars([]);
          setFilteredCars([]);
        }
      } catch (error) {
        console.error('Erro ao buscar carros:', error);
        setError('Erro ao carregar carros');
        setCars([]);
        setFilteredCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Aplicar filtros da URL
  useEffect(() => {
    if (!Array.isArray(cars) || cars.length === 0) return;

    const brand = searchParams.get('brand') || searchParams.get('marca');
    const model = searchParams.get('model') || searchParams.get('modelo');
    const priceMin = searchParams.get('priceMin') || searchParams.get('precoMin');
    const priceMax = searchParams.get('priceMax') || searchParams.get('precoMax');
    const yearMin = searchParams.get('yearMin') || searchParams.get('anoMin');
    const yearMax = searchParams.get('yearMax') || searchParams.get('anoMax');
    const fuelType = searchParams.get('fuelType') || searchParams.get('combustivel');
    const kmMin = searchParams.get('kmMin');
    const kmMax = searchParams.get('kmMax');

    let filtered = cars;

    if (brand) {
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(brand.toLowerCase())
      );
    }

    if (model) {
      filtered = filtered.filter(car => 
        car.model.toLowerCase().includes(model.toLowerCase())
      );
    }

    if (priceMin) {
      filtered = filtered.filter(car => car.price >= Number(priceMin));
    }

    if (priceMax) {
      filtered = filtered.filter(car => car.price <= Number(priceMax));
    }

    if (yearMin) {
      filtered = filtered.filter(car => car.year >= Number(yearMin));
    }

    if (yearMax) {
      filtered = filtered.filter(car => car.year <= Number(yearMax));
    }

    if (fuelType) {
      filtered = filtered.filter(car => 
        car.fuelType.toLowerCase() === fuelType.toLowerCase()
      );
    }

    if (kmMin) {
      filtered = filtered.filter(car => car.km >= Number(kmMin));
    }

    if (kmMax) {
      filtered = filtered.filter(car => car.km <= Number(kmMax));
    }

    setFilteredCars(filtered);
  }, [searchParams, cars]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">A carregar carros...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cars</h1>
          <p className="text-gray-600 mt-2">
            Number of listings: {Array.isArray(filteredCars) ? filteredCars.length : 0}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:w-1/4">
            <FilterSidebar />
          </div>

          {/* Lista de Carros */}
          <div className="lg:w-3/4">
            {!Array.isArray(filteredCars) || filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No cars found with the selected filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}