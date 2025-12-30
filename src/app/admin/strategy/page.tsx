"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- TIPOS DE DADOS ---
interface LocationData {
  Municipio: string;
  PoderCompra: number;
  Densidade: number;
  IdadeMedia: number;
  Score: number;
}

interface SalesData {
  brand: string;
  fuel: string;
  count: number;
}

// Custom Tooltip para o Gráfico mostrar o TOTAL
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Calcula o total somando as barras empilhadas
    const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);
    
    return (
      <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-xl text-xs">
        <p className="font-bold text-white mb-2 text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="text-white font-mono">{entry.value}</span>
          </div>
        ))}
        <div className="border-t border-gray-600 mt-2 pt-2 flex justify-between gap-4">
          <span className="font-bold text-blue-400">TOTAL VENDIDO:</span>
          <span className="font-bold text-white font-mono">{total}</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function StrategyPage() {
  const { data: session } = useSession();
  
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState<LocationData | null>(null);

  if (session && session.user.role !== "ADMIN") {
    redirect("/");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locRes = await fetch("/data/locations.json");
        const salesRes = await fetch("/data/sales_stats.json");
        
        const locData: LocationData[] = await locRes.json();
        const salesData: SalesData[] = await salesRes.json();

        setLocations(locData);
        if (locData.length > 0) setSelectedLoc(locData[0]);

        // Processar gráfico
        processChartData(salesData);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const processChartData = (data: SalesData[]) => {
    const brands: {[key: string]: any} = {};
    data.forEach(item => {
      if (!brands[item.brand]) {
        brands[item.brand] = { name: item.brand, total: 0 };
      }
      brands[item.brand][item.fuel] = item.count;
      brands[item.brand].total += item.count;
    });

    const processed = Object.values(brands)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 8); // Top 8 marcas

    setChartData(processed);
  };

  // --- LÓGICA SAD MELHORADA (V 2.0) ---
  const getRecommendation = (loc: LocationData) => {
    const recs = {
      segmento: "",
      tipo_stand: "",
      swot_strength: [] as string[],
      swot_weakness: [] as string[],
      swot_opportunity: [] as string[],
      action: ""
    };

    // 1. ANÁLISE DE PODER DE COMPRA (Define o PRODUTO)
    // Média nacional é 100.
    if (loc.PoderCompra >= 115) {
      recs.segmento = "Premium & Luxo (BMW, Mercedes, Tesla)";
      recs.swot_strength.push("Elevado poder de compra (Margens de lucro altas).");
      recs.swot_opportunity.push("Venda de serviços 'Upsell' (Garantias Premium, Detalhe).");
    } else if (loc.PoderCompra >= 95) {
      recs.segmento = "Gama Média (VW, Toyota, Peugeot)";
      recs.swot_strength.push("Mercado estável e abrangente.");
      recs.swot_opportunity.push("Campanhas de financiamento competitivas.");
    } else {
      recs.segmento = "Utilitários & Low-Cost (Dacia, Fiat, Usados)";
      recs.swot_strength.push("Alta procura por mobilidade acessível.");
      recs.swot_weakness.push("Clientes com elevada sensibilidade ao preço (Margens baixas).");
      recs.swot_opportunity.push("Foco no volume de vendas e rotação rápida de stock.");
    }

    // 2. ANÁLISE DE DENSIDADE (Define o ESPAÇO e LOGÍSTICA)
    // Porto ~5700, Matosinhos ~2900, Paredes ~500.
    if (loc.Densidade > 5000) {
      // EXTREMAMENTE URBANO (Ex: Porto Centro)
      recs.tipo_stand = "Showroom Digital / Boutique";
      recs.swot_strength.push("Máxima visibilidade e tráfego pedonal.");
      recs.swot_weakness.push("Dificil estacionamento e trânsito caótico.");
      recs.swot_weakness.push("Rendas elevadas.");
      recs.action = "Loja pequena em rua nobre. Stock físico mínimo (apenas exposição). Venda por catálogo digital.";
    
    } else if (loc.Densidade > 1700) {
      // URBANO (Ex: Matosinhos, Maia Centro)
      recs.tipo_stand = "Stand Urbano Compacto";
      recs.swot_strength.push("Boa visibilidade e acessos razoáveis.");
      recs.swot_weakness.push("Trânsito moderado em horas de ponta.");
      recs.action = "Stand com parque exterior limitado (10-20 carros). Foco em elétricos/híbridos para cidade.";
    
    } else {
      // SUBURBANO / RURAL (Ex: Paredes, Santo Tirso)
      recs.tipo_stand = "Mega-Stand / Warehouse";
      recs.swot_strength.push("Baixo custo do terreno/renda.");
      recs.swot_strength.push("Facilidade de estacionamento para clientes.");
      recs.swot_weakness.push("Menor tráfego natural (Exige marketing para atrair visita).");
      recs.action = "Grande armazém nos arredores. Stock massivo (>50 carros) e Oficina integrada.";
    }

    return recs;
  };

  if (loading) return <div className="p-10 text-white text-center">A carregar inteligência...</div>;
  const strategy = selectedLoc ? getRecommendation(selectedLoc) : null;

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white pb-20">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">SAD - Estratégia Comercial</h1>
          <p className="text-gray-400 mt-1">Simulação baseada em dados do INE e ACAP.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="mt-4 md:mt-0 bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded flex items-center gap-2 border border-gray-600 transition"
        >
          🖨️ Imprimir Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RANKING (Esquerda) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-lg h-full">
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <h2 className="font-bold text-lg">📍 Seleção de Localização</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900 text-gray-400 sticky top-0">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Município</th>
                    <th className="p-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {locations.map((loc, index) => (
                    <tr 
                      key={loc.Municipio} 
                      onClick={() => setSelectedLoc(loc)}
                      className={`cursor-pointer transition-colors hover:bg-gray-800 ${selectedLoc?.Municipio === loc.Municipio ? 'bg-blue-900/30 border-l-4 border-blue-500' : ''}`}
                    >
                      <td className="p-3 font-bold text-gray-500">#{index + 1}</td>
                      <td className="p-3 font-medium">{loc.Municipio}</td>
                      <td className="p-3 text-right font-bold text-yellow-500">{loc.Score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* DETALHES (Direita) */}
        <div className="lg:col-span-7 space-y-8">

          {/* PAINEL DE ESTRATÉGIA */}
          {selectedLoc && strategy && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Estratégia: {selectedLoc.Municipio}</h2>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span>💰 Poder: <b className="text-white">{selectedLoc.PoderCompra}</b></span>
                    <span>👥 Densidade: <b className="text-white">{selectedLoc.Densidade}</b> hab/km²</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-bold text-blue-500">{selectedLoc.Score}</span>
                  <span className="block text-xs text-gray-500">SCORE SAD</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <span className="text-xs uppercase text-gray-500 font-bold">Produto Recomendado</span>
                  <p className="text-md font-bold text-green-400 mt-1">{strategy.segmento}</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <span className="text-xs uppercase text-gray-500 font-bold">Tipo de Instalação</span>
                  <p className="text-md font-bold text-yellow-400 mt-1">{strategy.tipo_stand}</p>
                </div>
              </div>

              {/* SWOT DINÂMICA */}
              <div className="space-y-3 text-sm bg-black/20 p-4 rounded-lg">
                <h3 className="font-bold text-gray-300 border-b border-gray-700 pb-2 mb-2">Matriz SWOT Gerada</h3>
                
                {strategy.swot_strength.map((s, i) => (
                  <div key={`s-${i}`} className="flex gap-2 items-start">
                    <span className="bg-green-900 text-green-200 text-[10px] px-1.5 py-0.5 rounded font-bold mt-0.5">FORÇA</span>
                    <p className="text-gray-300">{s}</p>
                  </div>
                ))}
                
                {strategy.swot_weakness.map((w, i) => (
                  <div key={`w-${i}`} className="flex gap-2 items-start">
                    <span className="bg-red-900 text-red-200 text-[10px] px-1.5 py-0.5 rounded font-bold mt-0.5">FRAQUEZA</span>
                    <p className="text-gray-300">{w}</p>
                  </div>
                ))}
                
                {strategy.swot_opportunity.map((o, i) => (
                  <div key={`o-${i}`} className="flex gap-2 items-start">
                    <span className="bg-blue-900 text-blue-200 text-[10px] px-1.5 py-0.5 rounded font-bold mt-0.5">OPORT.</span>
                    <p className="text-gray-300">{o}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                 <p className="text-gray-300 italic"><span className="font-bold text-blue-400">Plano de Ação:</span> {strategy.action}</p>
              </div>
            </div>
          )}

          {/* GRÁFICO */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold mb-2">📊 Mix de Mercado (Outubro 2025)</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  {/* Tooltip Personalizado que mostra o TOTAL */}
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Gasóleo" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="Gasolina" stackId="a" fill="#EF4444" />
                  <Bar dataKey="Elétrico (BEV)" stackId="a" fill="#10B981" />
                  <Bar dataKey="PHEV/Gasolina" stackId="a" fill="#3B82F6" name="Híbrido" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}