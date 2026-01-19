import { prisma } from "@/lib/prisma"; // Confirma o caminho
import { DollarSign, Car, TrendingUp, PlusCircle, ArrowRight } from "lucide-react";
import DashboardChart from "@/components/DashboardChart"; 
import Link from "next/link";

// Força a página a ser gerada no servidor a cada pedido
export const dynamic = 'force-dynamic';

// Função auxiliar segura para formatar dinheiro
const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "0,00 €";
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

export default async function AdminDashboard() {
  try {
    // --- 1. BUSCAR DADOS (Queries em Paralelo) ---
    const [totalCars, totalValueData, soldCars, recentCars, brandStats] = await Promise.all([
      // A. Contar Disponíveis
      prisma.car.count({ where: { isAvailable: true } }),
      
      // B. Somar Valor (Aggregate)
      prisma.car.aggregate({
        _sum: { price: true },
        where: { isAvailable: true }
      }),

      // C. Contar Vendidos
      prisma.car.count({ where: { isAvailable: false } }),

      // D. Recentes (Top 5)
      prisma.car.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, brand: true, model: true, price: true, isAvailable: true, createdAt: true }
      }),

      // E. Estatísticas por Marca (Top 6)
      prisma.car.groupBy({
        by: ['brand'],
        _count: { brand: true },
        where: { isAvailable: true },
        orderBy: { _count: { brand: 'desc' } },
        take: 6,
      })
    ]);

    // --- 2. TRATAMENTO SEGURO DOS DADOS ---
    // O uso de "?." e "??" evita que o site vá abaixo se vier null
    const totalStockValue = totalValueData._sum?.price ?? 0;

    // --- 3. RENDERIZAÇÃO (HTML) ---
    return (
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-8">Dashboard Geral</h1>
        
        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Total Carros */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase">Em Stock</p>
              <p className="text-3xl font-bold mt-1">{totalCars}</p>
            </div>
            <div className="p-4 bg-blue-600/20 text-blue-500 rounded-full">
              <Car size={32} />
            </div>
          </div>

          {/* Card 2: Valor do Stock */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase">Valor do Stock</p>
              <p className="text-3xl font-bold mt-1 text-green-400">
                {formatCurrency(totalStockValue)}
              </p>
            </div>
            <div className="p-4 bg-green-600/20 text-green-500 rounded-full">
              <DollarSign size={32} />
            </div>
          </div>

          {/* Card 3: Carros Vendidos */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase">Vendidos</p>
              <p className="text-3xl font-bold mt-1 text-yellow-400">{soldCars}</p>
            </div>
            <div className="p-4 bg-yellow-600/20 text-yellow-500 rounded-full">
              <TrendingUp size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* TABELA DE RECENTES */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="font-bold text-lg">Últimas Entradas</h2>
              <Link href="/admin/add" className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded flex items-center gap-2 transition">
                <PlusCircle size={16} /> Novo
              </Link>
            </div>
            <div className="p-4">
              {recentCars.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Sem carros recentes.</p>
              ) : (
                <div className="space-y-3">
                  {recentCars.map((car) => (
                    <div key={car.id} className="flex justify-between items-center p-3 hover:bg-gray-700/50 rounded-lg transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${car.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-bold text-sm">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-400">{formatCurrency(car.price)}</p>
                        </div>
                      </div>
                      <Link href={`/cars/${car.id}`} className="text-gray-400 hover:text-white">
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* GRÁFICO (Chart) */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="font-bold text-lg mb-6">Stock por Marca</h2>
            <div className="h-64">
               {/* Passamos os dados tratados para o componente do gráfico */}
               <DashboardChart data={brandStats.map(b => ({ name: b.brand, value: b._count.brand }))} />
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error("❌ Erro fatal no Dashboard:", error);
    // UI de Erro (para o site não ir abaixo completamente)
    return (
      <div className="p-10 text-center text-red-400 bg-gray-900 rounded-xl border border-red-900">
        <h2 className="text-xl font-bold mb-2">Erro ao carregar Dashboard</h2>
        <p>Verifique a ligação à base de dados.</p>
      </div>
    );
  }
}
