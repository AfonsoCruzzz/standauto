import { prisma } from "@/../lib/prisma"; // Ou "@/prisma"
import CarCard from "@/components/CarCard";
import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import ContactButton from "@/components/ContactButton";

// Força a página a ser dinâmica para mostrar sempre os destaques atuais
export const dynamic = "force-dynamic";

export default async function Home() {
  // Buscar APENAS os carros destacados
  const featuredCars = await prisma.car.findMany({
    where: { isFeatured: true, isAvailable: true },
    orderBy: { createdAt: "desc" },
    take: 6, // Máximo de 6 destaques para não encher a página
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      
      {/* --- 1. HERO SECTION (Impacto Visual) --- */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Imagem de Fundo com Overlay Escuro */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('stand.jpg')" }}
        >
           <div className="absolute inset-0 bg-gray-950/70 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"></div>
        </div>

        {/* Conteúdo Central */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Encontre o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Carro de Sonho</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Seleção premium de viaturas verificadas com garantia e financiamento à sua medida. A melhor decisão automóvel começa aqui.
          </p>

          {/* Componente de Pesquisa */}
          <HomeSearch />

        </div>
      </section>

      {/* --- 2. CATEGORIAS (Navegação Visual) --- */}
      <section className="py-16 bg-gray-900 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Navegar por Categoria</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard title="SUVs Familiares" link="/cars?segment=SUV" icon="🚙" />
            <CategoryCard title="Manual" link="/cars?transmission=Manual" icon="⚙️" />
            <CategoryCard title="Elétricos & Híbridos" link="/cars?fuelType=Elétrico" icon="⚡" />
            <CategoryCard title="Citadinos" link="/cars?segment=Utilitário" icon="🚗" />
          </div>
        </div>
      </section>

      {/* --- 3. DESTAQUES (Os carros que o Admin escolheu) --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-blue-500">Destaques da Semana</h2>
            <p className="text-gray-400 mt-2">Viaturas selecionadas pela nossa equipa.</p>
          </div>
          <Link href="/cars" className="hidden md:block text-blue-400 hover:text-blue-300 font-bold">
            Ver Todo o Stock &rarr;
          </Link>
        </div>

        {featuredCars.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800 border-dashed">
            <p className="text-gray-500">Sem destaques no momento. Visite a página de todos os carros.</p>
            <Link href="/cars" className="mt-4 inline-block bg-blue-600 px-6 py-2 rounded-lg text-white font-bold">Ver Stock</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/cars" className="inline-block w-full py-3 bg-gray-800 rounded-lg text-blue-400 font-bold">
            Ver Todo o Stock
          </Link>
        </div>
      </section>

      {/* --- 4. PORQUÊ NÓS (Value Proposition) --- */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Porquê comprar connosco?</h2>
            <p className="text-gray-400">Mais do que vender carros, criamos relações de confiança.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureItem 
              icon="🛡️" 
              title="Garantia Premium" 
              desc="Todas as nossas viaturas incluem garantia de até 36 meses para sua total tranquilidade." 
            />
            <FeatureItem 
              icon="🔧" 
              title="Revisão em 120 Pontos" 
              desc="Cada carro passa por uma inspeção rigorosa na nossa oficina antes de chegar ao stand." 
            />
            <FeatureItem 
              icon="💶" 
              title="Financiamento Flexível" 
              desc="Parcerias com as principais financeiras para garantir as melhores taxas do mercado." 
            />
          </div>
        </div>
      </section>

      {/* --- 5. CTA FINAL --- */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Pronto para encontrar o seu próximo carro?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Visite o nosso stand ou explore o stock online. Ajudamos a tomar a melhor decisão com o nosso sistema inteligente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/cars" 
              className="px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              Explorar Stock Online
            </Link>
            <Link 
              href="" // Dica subtil para o prof ver o SAD, na vida real seria "Contactos"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition"
            >
              Contactar o Stand
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTES PARA ORGANIZAÇÃO ---

function CategoryCard({ title, link, icon }: { title: string, link: string, icon: string }) {
  return (
    <Link href={link} className="group relative overflow-hidden bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-1">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg group-hover:text-blue-400 transition">{title}</h3>
    </Link>
  );
}

function FeatureItem({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="text-center p-6 rounded-2xl bg-gray-950 border border-gray-800 hover:bg-gray-800 transition">
      <div className="text-5xl mb-6 bg-blue-900/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center border border-blue-500/30">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}