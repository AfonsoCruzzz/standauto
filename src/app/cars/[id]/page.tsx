import { prisma } from "@/../lib/prisma"; // Ajusta o import conforme o teu projeto
import { notFound } from "next/navigation";
import CarGallery from "@/components/CarGallery";
import ContactButton from "@/components/ContactButton";
import { Calendar, Gauge, Fuel, Cog, CarFront, Zap, ShieldCheck, CheckCircle2, XCircle, LayoutGrid } from "lucide-react"; // Ícones (instala lucide-react se não tiveres)

// Função para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price);
};

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Faz o await dos params antes de usar!
  const { id } = await params; 

  // 3. Agora já podes usar o "id" no prisma
  const car = await prisma.car.findUnique({
    where: { id: id },
  });

  if (!car) return notFound(); // Se o ID não existir, dá erro 404

  return (
    <div className="bg-gray-950 min-h-screen text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        
        {/* --- CABEÇALHO --- */}
        <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {car.brand} {car.model} <span className="text-gray-500 text-2xl">{car.submodel}</span>
            </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span className="bg-gray-800 px-3 py-1 rounded-full text-white">{car.condition}</span>
            <span>Ref: {car.id.slice(0, 8)}</span>
            <span>Publicado a: {new Date(car.createdAt).toLocaleDateString('pt-PT')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- COLUNA ESQUERDA: GALERIA E DESCRIÇÃO (2/3) --- */}
          <div className="lg:col-span-2 space-y-8">
            <CarGallery images={car.images} title={`${car.brand} ${car.model}`} />
            
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Sobre este veículo</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {car.description || "Sem descrição disponível."}
              </p>
            </div>

             {/* INFO DE GARANTIA (SEGUROS) */}
             {car.warranty ? (
              <div className="bg-green-900/20 border border-green-800 p-6 rounded-xl flex items-start gap-4">
                <ShieldCheck className="w-10 h-10 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-400 text-lg">Garantia Incluída</h3>
                  <p className="text-gray-300">Este veículo inclui um pacote de garantia de: <span className="text-white font-bold">{car.warranty}</span>.</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-start gap-4 opacity-70">
                <ShieldCheck className="w-10 h-10 text-gray-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-400">Sem Garantia Extra</h3>
                  <p className="text-sm text-gray-500">Vendido no estado em que se encontra ou sob consulta.</p>
                </div>
              </div>
            )}
          </div>

          {/* --- COLUNA DIREITA: PREÇO E ESPECIFICAÇÕES (1/3) --- */}
          <div className="space-y-6">
            
            {/* CARD DE PREÇO */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 sticky top-4">
              <div className="mb-6">
                <p className="text-sm text-gray-400">Preço de Venda</p>
                <div className="text-4xl font-bold text-blue-500">{formatPrice(car.price)}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between p-3 bg-gray-800 rounded">
                  <span className="text-gray-400 flex items-center gap-2"><CheckCircle2 size={16}/> Disponibilidade</span>
                  {car.isAvailable ? (
                    <span className="text-green-400 font-bold">Disponível</span>
                  ) : (
                    <span className="text-red-400 font-bold">Vendido</span>
                  )}
                </div>
              </div>

              <ContactButton carTitle={`${car.brand} ${car.model}`} />
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Necessário login para contactar.
              </p>
            </div>

            {/* GRELHA DE ESPECIFICAÇÕES TÉCNICAS */}
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
              <h3 className="font-bold text-lg mb-4">Caraterísticas</h3>
              <div className="grid grid-cols-2 gap-4">
                
                <SpecItem icon={<Calendar size={18}/>} label="Ano" value={car.year} />
                <SpecItem icon={<Gauge size={18}/>} label="Quilómetros" value={`${car.km.toLocaleString()} km`} />
                <SpecItem icon={<Fuel size={18}/>} label="Combustível" value={car.fuelType} />
                <SpecItem icon={<Cog size={18}/>} label="Caixa" value={car.transmission} />
                <SpecItem icon={<Zap size={18}/>} label="Potência" value={`${car.power} cv`} />
                <SpecItem icon={<CarFront size={18}/>} label="Cilindrada" value={`${car.engineSize} cm³`} />
                <SpecItem icon={<LayoutGrid size={18}/>} label="Segmento" value={car.segment} />               

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Componente Pequeno para os items da grelha
function SpecItem({ icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-1 p-2 bg-gray-950/50 rounded border border-gray-800">
      <div className="text-blue-500 mb-1">{icon}</div>
      <span className="text-xs text-gray-500 uppercase">{label}</span>
      <span className="font-bold text-white text-sm truncate">{value}</span>
    </div>
  );
}