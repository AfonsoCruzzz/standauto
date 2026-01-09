import { prisma } from "@/../lib/prisma"; // Certifica-te que o caminho está certo (ex: @/lib/prisma ou @/../lib/prisma)
import { notFound } from "next/navigation";
import CarGallery from "@/components/CarGallery";
import ContactButton from "@/components/ContactButton";
import AdminCarControls from "@/components/AdminCarControls"; // <--- O componente que criaste no passo anterior
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth"; // <--- Confirma se o teu ficheiro auth.ts está aqui
import { 
  Calendar, Gauge, Fuel, Cog, CarFront, Zap, ShieldCheck, 
  CheckCircle2, XCircle, LayoutGrid, DoorOpen, Paintbrush, Armchair 
} from "lucide-react";
import Link from "next/link";

// Função para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price);
};

// Componente auxiliar para os itens da grelha (Mantive o teu design)
function SpecItem({ icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-gray-700 transition">
      <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold tracking-wider">
        <span className="text-blue-500">{icon}</span>
        {label}
      </div>
      <div className="text-white font-medium pl-6 text-sm md:text-base truncate">
        {value || "N/A"}
      </div>
    </div>
  );
}

export default async function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Obter dados da sessão (para saber se é ADMIN)
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  // 2. Resolver os parâmetros (Next.js 15)
  const { id } = await params; 

  // 3. Buscar o carro à BD
  const car = await prisma.car.findUnique({
    where: { id: id },
  });

  if (!car) return notFound();

  return (
    <div className="bg-gray-950 min-h-screen text-white pb-20">
      <div className="container mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-white transition">Home</Link> &gt; 
          <Link href="/cars" className="hover:text-white transition">Carros</Link> &gt; 
          <span className="text-blue-500 font-medium truncate">{car.brand} {car.model}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* --- COLUNA DA ESQUERDA: GALERIA --- */}
          <div className="relative">
            {/* Overlay de VENDIDO (Fita vermelha) */}
            {!car.isAvailable && (
              <div className="absolute top-6 left-0 z-20 bg-red-600 text-white font-bold px-8 py-2 text-xl shadow-lg transform -rotate-6 border-y-2 border-white/20 backdrop-blur-sm">
                VENDIDO
              </div>
            )}
            
            {/* Galeria de Imagens */}
            <CarGallery images={car.images} title={`${car.brand} ${car.model}`} />
          </div>

          {/* --- COLUNA DA DIREITA: INFORMAÇÕES --- */}
          <div className="space-y-8">

            {/* PAINEL DE ADMIN (Só aparece se for ADMIN) */}
            {isAdmin && (
               <AdminCarControls carId={car.id} isAvailable={car.isAvailable} />
            )}

            {/* Cabeçalho do Carro */}
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">{car.brand} {car.model}</h1>
                
                {/* Badge de Disponibilidade */}
                {car.isAvailable ? (
                    <span className="flex items-center gap-1 text-green-400 bg-green-900/30 px-3 py-1 rounded-full text-xs font-bold border border-green-800">
                        <CheckCircle2 size={14} /> DISPONÍVEL
                    </span>
                ) : (
                    <span className="flex items-center gap-1 text-red-400 bg-red-900/30 px-3 py-1 rounded-full text-xs font-bold border border-red-800">
                        <XCircle size={14} /> VENDIDO
                    </span>
                )}
              </div>

              <p className="text-xl text-gray-400 font-light">{car.submodel}</p>
              
              <div className="mt-4 text-4xl font-bold text-blue-500 tracking-tight">
                {formatPrice(car.price)}
              </div>
            </div>

            {/* Grelha de Especificações (Com os teus ícones) */}
            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
                <Cog className="text-blue-500" size={20} /> Especificações
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <SpecItem icon={<Calendar size={16}/>} label="Ano" value={car.year} />
                <SpecItem icon={<Gauge size={16}/>} label="Quilómetros" value={`${car.km.toLocaleString()} km`} />
                <SpecItem icon={<Fuel size={16}/>} label="Combustível" value={car.fuelType} />
                <SpecItem icon={<Cog size={16}/>} label="Caixa" value={car.transmission} />
                <SpecItem icon={<Zap size={16}/>} label="Potência" value={car.power ? `${car.power} cv` : "N/A"} />
                <SpecItem icon={<CarFront size={16}/>} label="Cilindrada" value={car.engineSize ? `${car.engineSize} cm³` : "N/A"} />
                <SpecItem icon={<LayoutGrid size={16}/>} label="Segmento" value={car.segment} />
              </div>
            </div>

            {/* Garantia (Destaque) */}
            <div className="bg-blue-900/10 border border-blue-800/50 p-4 rounded-xl flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                <ShieldCheck size={32} />
              </div>
              <div>
                <p className="text-xs text-blue-300 font-bold uppercase tracking-wide">Garantia Incluída</p>
                <p className="text-lg font-bold text-white">{car.warranty || "Sob Consulta"}</p>
              </div>
            </div>

            {/* Descrição */}
            {car.description && (
              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-3 text-gray-200">Sobre esta viatura</h3>
                <p className="text-gray-400 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {car.description}
                </p>
              </div>
            )}

            {/* Botão de Ação (Condicional: Contacto ou Vendido) */}
            <div className="pt-4">
              {car.isAvailable ? (
                // Se disponível, mostra o teu botão de contacto original
                <ContactButton carTitle={`${car.brand} ${car.model}`} />
              ) : (
                // Se vendido, mostra botão desativado
                <button disabled className="w-full bg-gray-800 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed text-lg border border-gray-700 flex items-center justify-center gap-2 hover:bg-gray-800 opacity-70">
                  <XCircle size={24} />
                  Veículo Indisponível
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}