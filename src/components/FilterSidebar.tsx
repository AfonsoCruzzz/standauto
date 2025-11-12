'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    marca: searchParams.get('marca') || '',
    modelo: searchParams.get('modelo') || '',
    subModelo: searchParams.get('subModelo') || '',
    segmento: searchParams.get('segmento') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    anoMin: searchParams.get('anoMin') || '',
    anoMax: searchParams.get('anoMax') || '',
    combustivel: searchParams.get('combustivel') || '',
    kmMin: searchParams.get('kmMin') || '',
    kmMax: searchParams.get('kmMax') || '',
  });

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    router.push(`/carros?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      marca: '',
      modelo: '',
      subModelo: '',
      segmento: '',
      precoMin: '',
      precoMax: '',
      anoMin: '',
      anoMax: '',
      combustivel: '',
      kmMin: '',
      kmMax: '',
    });
    router.push('/carros');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>
      
      <div className="space-y-4">
        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <input
            type="text"
            value={filters.marca}
            onChange={(e) => setFilters({...filters, marca: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Mercedes-Benz"
          />
        </div>

        {/* Modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modelo
          </label>
          <input
            type="text"
            value={filters.modelo}
            onChange={(e) => setFilters({...filters, modelo: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Classe A"
          />
        </div>

        {/* Sub-modelo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-modelo
          </label>
          <input
            type="text"
            value={filters.subModelo}
            onChange={(e) => setFilters({...filters, subModelo: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: AMG Line"
          />
        </div>

        {/* Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.precoMin}
              onChange={(e) => setFilters({...filters, precoMin: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="De"
            />
            <input
              type="number"
              value={filters.precoMax}
              onChange={(e) => setFilters({...filters, precoMax: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Até"
            />
          </div>
        </div>

        {/* Ano */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ano
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.anoMin}
              onChange={(e) => setFilters({...filters, anoMin: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="De"
            />
            <input
              type="number"
              value={filters.anoMax}
              onChange={(e) => setFilters({...filters, anoMax: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Até"
            />
          </div>
        </div>

        {/* Combustível */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Combustível
          </label>
          <select
            value={filters.combustivel}
            onChange={(e) => setFilters({...filters, combustivel: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Elétrico">Elétrico</option>
            <option value="GPL">GPL</option>
          </select>
        </div>

        {/* Quilómetros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quilómetros
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.kmMin}
              onChange={(e) => setFilters({...filters, kmMin: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="De"
            />
            <input
              type="number"
              value={filters.kmMax}
              onChange={(e) => setFilters({...filters, kmMax: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Até"
            />
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={applyFilters}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Aplicar Filtros
        </button>
        <button
          onClick={clearFilters}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
        >
          Limpar
        </button>
      </div>
    </div>
  );
}