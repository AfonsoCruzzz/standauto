"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// --- 1. FUNÇÃO AUXILIAR (Limpeza e Segurança) ---
// Garante que o link é válido, removendo barras extra se existirem
const getCleanUrl = (url: string | undefined | null) => {
  if (!url) return "/placeholder.jpg"; // Caminho da tua imagem de recurso
  
  // Corrige o bug da base de dados (remove o / inicial se for link externo)
  if (url.startsWith("/http")) {
    return url.substring(1);
  }
  
  return url;
};

// --- 2. SUB-COMPONENTE DE MINIATURA ---
// Isolamos isto para que cada miniatura gira o seu próprio erro individualmente
const Thumbnail = ({ src, isActive, onClick, alt }: any) => {
  // Estado local para gerir se esta miniatura específica partiu
  const [thumbSrc, setThumbSrc] = useState(getCleanUrl(src));

  // Se a prop src mudar (ex: navegar para outro carro), resetamos o estado
  useEffect(() => {
    setThumbSrc(getCleanUrl(src));
  }, [src]);

  return (
    <button
      onClick={onClick}
      className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
        isActive ? "border-blue-500 opacity-100" : "border-transparent opacity-70 hover:opacity-100"
      }`}
    >
      <Image
        src={thumbSrc}
        alt={alt}
        fill
        className="object-cover"
        // Se der erro (404 ou formato inválido), troca por placeholder SÓ nesta miniatura
        onError={() => setThumbSrc("/placeholder.jpg")}
      />
    </button>
  );
};

// --- 3. COMPONENTE PRINCIPAL ---
export default function CarGallery({ images, title }: { images: string[], title: string }) {
  // Estado da imagem que está SELECIONADA (o URL original)
  const [selectedImage, setSelectedImage] = useState<string>(images?.[0] || "");
  
  // Estado da imagem que é EXIBIDA (pode mudar para placeholder se der erro)
  const [displaySrc, setDisplaySrc] = useState<string>(getCleanUrl(images?.[0]));

  // Atualiza a imagem principal quando o utilizador clica numa thumb
  // ou quando o array de imagens muda (ex: carregou outro carro)
  useEffect(() => {
    const newImage = images?.[0] || "";
    setSelectedImage(newImage);
    setDisplaySrc(getCleanUrl(newImage));
  }, [images]);

  // Função para trocar de imagem manualmente
  const handleSelectImage = (img: string) => {
    setSelectedImage(img);
    setDisplaySrc(getCleanUrl(img)); // Reseta o display para tentar mostrar a nova imagem
  };

  return (
    <div className="space-y-4">
      {/* --- ÁREA DA IMAGEM GRANDE --- */}
      <div className="relative h-[400px] md:h-[600px] w-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-2xl">
        <Image
          src={displaySrc || "/placeholder.jpg"}
          alt={title}
          fill
          className="object-cover"
          priority // Dá prioridade de carregamento (LCP)
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          // Se a imagem grande falhar, mostra placeholder
          onError={() => setDisplaySrc("/placeholder.jpg")}
        />
      </div>

      {/* --- LISTA DE MINIATURAS (Scrollable) --- */}
      {images && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {images.map((img, index) => (
            <Thumbnail
              key={`${img}-${index}`}
              src={img}
              alt={`${title} view ${index + 1}`}
              isActive={selectedImage === img}
              onClick={() => handleSelectImage(img)}
            />
          ))}
        </div>
      )}
    </div>
  );
}