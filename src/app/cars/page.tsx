"use client";

import { useState, useEffect } from "react";
import CarCard from "@/components/CarCard";
import { useSearchParams, useRouter } from "next/navigation";

export default function CarsPage() {
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

  // Função para buscar carros com os filtros atuais
    const fetchCars = async () => {
        setLoading(true);
        const query = new URLSearchParams();

        // Só adiciona ao URL se tiver valor real
        if (filters.brand) query.append("brand", filters.brand);
        if (filters.minPrice) query.append("minPrice", filters.minPrice);
        if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);

        // Debug: Podes ver no console do browser o URL que está a ser gerado
        console.log("A pedir carros com URL:", `/api/cars?${query.toString()}`);

        try {
            const res = await fetch(`/api/cars?${query.toString()}`, { 
            cache: "no-store" // Garante que não busca dados antigos
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

  // Atualiza a lista quando a página carrega ou mudamos filtros
  useEffect(() => {
    fetchCars();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars();
    // Opcional: Atualizar URL visualmente
    // router.push(`/cars?brand=${filters.brand}...`)
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-500">Todos os Veículos</h1>

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
                className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                value={filters.brand}
                onChange={(e) => setFilters({...filters, brand: e.target.value})}
              />
            </div>

            <div className="flex gap-2">
              <div className="w-1/2">
                <label className="block text-sm text-gray-400 mb-1">Preço Min</label>
                <input 
                  type="number" 
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm text-gray-400 mb-1">Preço Max</label>
                <input 
                  type="number" 
                  className="w-full p-2 bg-gray-700 rounded border border-gray-600"
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
    </div>
  );
}