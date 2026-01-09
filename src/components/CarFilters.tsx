"use client";

import { useState } from "react";

// Definimos o tipo de dados dos filtros
export type FilterState = {
  keyword: string;     // Pesquisa geral (Marca ou Modelo)
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  maxKm: string;
  fuelType: string;
  transmission: string;
  segment: string;
  status: string;
};

interface CarFiltersProps {
  onFilter: (filters: FilterState) => void;
  loading: boolean;
  initialFilters?: FilterState;
}

export default function CarFilters({ onFilter, loading }: CarFiltersProps) {
  // Estado inicial vazio
  const initialFilters = {
    keyword: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    maxKm: "",
    fuelType: "",
    transmission: "",
    segment: "",
    status: "available",
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilter(initialFilters);
  };

  return (
    <aside className="w-full md:w-1/4 bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h2 className="text-xl font-bold text-white">Filtros</h2>
        <button 
          onClick={handleReset} 
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Limpar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Pesquisa Livre */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Pesquisa</label>
          <input
            type="text"
            name="keyword"
            placeholder="Marca ou Modelo..."
            value={filters.keyword}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm focus:border-blue-500 transition"
          />
        </div>

        <div>
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Estado</label>
          <select 
              name="status" 
              value={filters.status} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm focus:border-blue-500"
          >
              <option value="available">Disponíveis (Padrão)</option>
              <option value="sold">Vendidos</option>
              <option value="all">Todos (Histórico)</option>
          </select>
        </div>

        {/* Preço */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Preço (€)</label>
          <div className="flex gap-2">
            <input type="number" name="minPrice" placeholder="Mín" value={filters.minPrice} onChange={handleChange} className="w-1/2 p-2 bg-gray-800 rounded border border-gray-700 text-white text-sm" />
            <input type="number" name="maxPrice" placeholder="Máx" value={filters.maxPrice} onChange={handleChange} className="w-1/2 p-2 bg-gray-800 rounded border border-gray-700 text-white text-sm" />
          </div>
        </div>

        {/* Segmento (NOVO) */}
        <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Segmento</label>
            <select name="segment" value={filters.segment} onChange={handleChange} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm">
                <option value="">Todos</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Utilitário">Utilitário</option>
                <option value="Comercial">Comercial</option>
                <option value="Coupé">Coupé</option>
                <option value="Cabrio">Cabrio</option>
            </select>
        </div>

        {/* Ano */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ano</label>
          <div className="flex gap-2">
            <input type="number" name="minYear" placeholder="De" value={filters.minYear} onChange={handleChange} className="w-1/2 p-2 bg-gray-800 rounded border border-gray-700 text-white text-sm" />
            <input type="number" name="maxYear" placeholder="Até" value={filters.maxYear} onChange={handleChange} className="w-1/2 p-2 bg-gray-800 rounded border border-gray-700 text-white text-sm" />
          </div>
        </div>

        {/* Combustível */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Combustível</label>
          <select name="fuelType" value={filters.fuelType} onChange={handleChange} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 text-white text-sm">
            <option value="">Todos</option>
            <option value="Gasóleo">Gasóleo</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Elétrico">Elétrico</option>
            <option value="Híbrido (PHEV)">Híbrido (PHEV)</option>
            <option value="Híbrido (Gasolina)">Híbrido (Gasolina)</option>
          </select>
        </div>

        {/* Caixa e KM */}
        <div className="grid grid-cols-2 gap-2">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Caixa</label>
                <select name="transmission" value={filters.transmission} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white text-sm">
                    <option value="">Todas</option>
                    <option value="Manual">Manual</option>
                    <option value="Automática">Auto</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Km (Máx)</label>
                <input type="number" name="maxKm" placeholder="Ex: 100000" value={filters.maxKm} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white text-sm" />
            </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? "A filtrar..." : "Aplicar Filtros"}
        </button>
      </form>
    </aside>
  );
}