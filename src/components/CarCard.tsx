"use client"; // Necessário porque vamos usar useState

import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; // <--- Importar useState
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation";

// Define o tipo se ainda não tiveres, ou importa do prisma/client
type CarProps = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuelType: string;
  images: string[];
  isFeatured?: boolean;
  createdAt: Date;
  submodel?: string | null; 
  segment?: string | null;
  transmission?: string | null;
  power?: number | null;
  doors?: number | null;
  seats?: number | null;
  warranty?: string | null;
  color?: string | null;
};

export default function CarCard({ car }: { car: CarProps }) {
  // Lógica inteligente:
  // 1. Tenta usar a primeira imagem do carro.
  // 2. Se não houver imagens, usa o placeholder.
  const { data: session } = useSession(); // Para saber se é admin
  const router = useRouter();
  const [isFeatured, setIsFeatured] = useState(car.isFeatured || false); // Adiciona isFeatured à interface CarProps

  const toggleFeatured = async (e: React.MouseEvent) => {
    e.preventDefault(); // Para não abrir o link do carro
    e.stopPropagation();

    const newState = !isFeatured;
    setIsFeatured(newState); // UI otimista (muda logo a cor)

    // Chama a API
    await fetch(`/api/cars/${car.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isFeatured: newState }),
    });
    
    router.refresh(); // Atualiza a página para refletir mudanças
  };

  const [imgSrc, setImgSrc] = useState(
    car.images && car.images.length > 0 ? car.images[0] : "/placeholder.jpg"
  );

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-700 flex flex-col h-full">
      {/* Container da Imagem */}
      <div className="relative h-48 w-full bg-gray-700">
        <Image
          src={imgSrc}
          alt={`${car.brand} ${car.model} ${car.submodel}`}
          fill // O fill faz a imagem ocupar o espaço todo do pai (h-48)
          className="object-cover" // Garante que a imagem não fica esticada
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          // O SEGREDO ESTÁ AQUI:
          onError={() => setImgSrc("/placeholder.jpg")} 
        />
        
        {/* Etiqueta do Preço (Exemplo de UI melhorada) */}
        <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full font-bold shadow-md">
          {car.price.toLocaleString("pt-PT")} €
        </div>
          {session?.user?.role === "ADMIN" && (
            <button
              onClick={toggleFeatured}
              className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white z-10 transition"
              title={isFeatured ? "Remover da Home" : "Adicionar à Home"}
            >
              {isFeatured ? "★" : "☆"} 
            </button>
          )}
      </div>

      {/* Detalhes do Carro */}
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-white mb-1">
          {car.brand} {car.model}
        </h2>
        <div className="text-sm text-gray-400 mb-4 flex gap-2">
          <span>{car.year}</span> • 
          <span>{car.km.toLocaleString()} km</span> • 
          <span>{car.fuelType}</span>
        </div>

        <Link
          href={`/cars/${car.id}`}
          className="mt-auto block w-full text-center bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition-colors"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}