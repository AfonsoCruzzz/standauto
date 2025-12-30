"use client";
import { useState } from "react";
import Image from "next/image";

export default function CarGallery({ images, title }: { images: string[], title: string }) {
  const [mainImage, setMainImage] = useState(images[0] || "/placeholder-car.jpg");

  return (
    <div className="space-y-4">
      {/* Imagem Principal */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <Image 
          src={mainImage} 
          alt={title} 
          fill 
          className="object-cover"
        />
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
              mainImage === img ? "border-blue-500" : "border-transparent"
            }`}
          >
            <Image src={img} alt={`Thumb ${index}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}