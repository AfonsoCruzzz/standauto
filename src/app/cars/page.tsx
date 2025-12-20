"use client";

import { useState, useEffect, Suspense } from "react";
import CarCard from "@/components/CarCard";
import { useSearchParams, useRouter } from "next/navigation";

// 1. Criamos um componente ISOLADO que contém toda a lógica "perigosa" (useSearchParams)
function CarsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const fetchCars = async () => {
    setLoading(true);
    const query = new URLSearchParams();

    if (filters.brand) query.append("brand", filters.brand);
    if (filters.minPrice) query.append("minPrice", filters.minPrice);
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

    try {
      // Nota: Adicionamos /api para garantir que o caminho está certo
      const res = await fetch(`/api/cars?${query.toString()}`, { 
        cache: "no-store" 
      }); 
      
      if (!res.ok) throw new Error("Falha no fetch");
      
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars();
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* --- SIDEBAR FILTROS --- */}
      <aside className="w-full md:w-1/4 bg-gray-800 p-6 rounded-lg h-fit">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Filtros</h2>
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Marca</label>
            <input 
              type="text" 
              placeholder="Ex: BMW" 
              className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm text-gray-400 mb-1">Min €</label>
              <input 
                type="number" 
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-400 mb-1">Max €</label>
              <input 
                type="number" 
                className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-bold mt-4">
            Aplicar Filtros
          </button>
        </form>
      </aside>

      {/* --- GRELHA DE CARROS --- */}
      <div className="w-full md:w-3/4">
        {loading ? (
          <p className="text-center text-gray-400 mt-10">A carregar veículos...</p>
        ) : cars.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Nenhum carro encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car: any) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. O Componente Principal é "Oco", serve apenas para carregar o Suspense
export default function CarsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-500">Todos os Veículos</h1>
      
      {/* O SEGREDO ESTÁ AQUI: Envolver o componente num Suspense Boundary */}
      <Suspense fallback={<div className="text-white text-center">A carregar filtros...</div>}>
        <CarsListContent />
      </Suspense>
    </div>
  );
}