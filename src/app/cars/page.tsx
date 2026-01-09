"use client";

import { useState, useEffect, Suspense } from "react";
import CarCard from "@/components/CarCard";
import CarFilters, { FilterState } from "@/components/CarFilters"; // <--- Importa o novo componente
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Componente isolado para gestão de estado e busca
function CarsListContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Ler o URL quando a página carrega
  const initialFilters: FilterState = {
    keyword: searchParams.get("keyword") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minYear: searchParams.get("minYear") || "",
    maxYear: searchParams.get("maxYear") || "",
    maxKm: searchParams.get("maxKm") || "",
    fuelType: searchParams.get("fuelType") || "",
    transmission: searchParams.get("transmission") || "",
    segment: searchParams.get("segment") || "", // <--- Lê o segmento do link da Home
    status: searchParams.get("status") || "available",
  };

  const fetchCars = async (filtersToUse: FilterState) => {
    setLoading(true);
    const query = new URLSearchParams();

    // Constrói a query string com base nos filtros recebidos
    Object.entries(filtersToUse).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    try {
      const res = await fetch(`/api/cars?${query.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha no fetch");
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Executar a busca assim que a página abre usando os filtros do URL
  useEffect(() => {
    fetchCars(initialFilters);
  }, []); // Array vazio = corre só uma vez no início

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Passamos o initialFilters para o componente visual saber o que mostrar */}
      <CarFilters onFilter={fetchCars} loading={loading} initialFilters={initialFilters} />

      <div className="w-full md:w-3/4">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-300">Resultados ({cars.length})</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
             {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>)}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-gray-400">Nenhum veículo encontrado.</p>
          </div>
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

export default function CarsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-500 text-center md:text-left">Todos os Veículos</h1>
      {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-white">Home</Link> &gt; 
          <Link href="/cars" className="text-blue-500 ml-1">Carros</Link> &gt; 
        </div>
      <Suspense fallback={<div className="text-white text-center">A carregar...</div>}>
        <CarsListContent />
      </Suspense>
    </div>
  );
}