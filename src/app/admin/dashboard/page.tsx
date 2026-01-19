import { prisma } from "@/../lib/prisma"; // Confirma se o caminho está certo
import Link from "next/link";
import { DollarSign, Car, TrendingUp, PlusCircle, ArrowRight } from "lucide-react";
import DashboardChart from "@/components/DashboardChart"; // O componente que criaste acima

// Função auxiliar para formatar dinheiro
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // --- 1. BUSCAR DADOS (QUERIES PARALELAS PARA RAPIDEZ) ---
  const [totalCars, totalValue, soldCars, recentCars, brandStats] = await Promise.all([
    // Contar carros disponíveis
    prisma.car.count({ where: { isAvailable: true } }),
    
    // Somar o valor total do stock (soma dos preços)
    prisma.car.aggregate({
      _sum: { price: true },
      where: { isAvailable: true }
    }),

    // Contar carros vendidos (não disponíveis)
    prisma.car.count({ where: { isAvailable: false } }),

    // Buscar os 5 últimos carros adicionados
    prisma.car.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, brand: true, model: true, price: true, isAvailable: true, createdAt: true }
    }),

    // Agrupar por marca para o gráfico
    prisma.car.groupBy({
      by: ['brand'],
      _count: { brand: true },
      where: { isAvailable: true },
      orderBy: { _count: { brand: 'desc' } },
      take: 6,
    })
  ]);

  const stockValue = totalValue._sum.price || 0;
  const averagePrice = totalCars > 0 ? stockValue / totalCars : 0;

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white pb-20">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Painel de Controlo</h1>
          <p className="text-gray-400">Visão geral do teu Stand Automóvel.</p>
        </div>
        <Link 
          href="/admin/cars/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition"
        >
          <PlusCircle size={20} />
          Adicionar Viatura
        </Link>
      </div>

      {/* --- GRID DE KPIs (INDICADORES) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* KPI 1: Valor em Stock */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 font-medium">Valor em Stock</p>
              <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stockValue)}</h3>
            </div>
            <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        {/* KPI 2: Total de Carros */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 font-medium">Viaturas Disponíveis</p>
              <h3 className="text-2xl font-bold text-white mt-1">{totalCars}</h3>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
              <Car size={24} />
            </div>
          </div>
        </div>

        {/* KPI 3: Vendas (Indisponíveis) */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 font-medium">Viaturas Vendidas</p>
              <h3 className="text-2xl font-bold text-white mt-1">{soldCars}</h3>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        {/* KPI 4: Preço Médio */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-400 font-medium">Preço Médio</p>
              <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(averagePrice)}</h3>
            </div>
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- GRÁFICO (ESQUERDA - 2/3) --- */}
        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6">Distribuição de Stock por Marca</h3>
          <DashboardChart data={brandStats} />
        </div>

        {/* --- ATIVIDADE RECENTE (DIREITA - 1/3) --- */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Adicionados Recentemente</h3>
            <Link href="/cars" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentCars.map((car) => (
              <div key={car.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition">
                <div>
                  <p className="font-bold text-white text-sm">{car.brand} {car.model}</p>
                  <p className="text-xs text-gray-400">{new Date(car.createdAt).toLocaleDateString('pt-PT')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-400 text-sm">{formatCurrency(car.price)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${car.isAvailable ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                    {car.isAvailable ? 'Stock' : 'Vendido'}
                  </span>
                </div>
              </div>
            ))}
            
            {recentCars.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">Ainda não tens carros registados.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
