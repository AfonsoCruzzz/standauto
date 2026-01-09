"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminCarControls({ carId, isAvailable }: { carId: string, isAvailable: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Função para marcar como VENDIDO
  const handleMarkSold = async () => {
    if (!confirm("Tem a certeza que quer marcar este carro como VENDIDO?")) return;
    setLoading(true);

    await fetch(`/api/cars/${carId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: false }), // Muda estado na BD
    });

    setLoading(false);
    router.refresh(); // Atualiza a página para mostrar "Vendido"
  };

  // Função para APAGAR
  const handleDelete = async () => {
    if (!confirm("⚠️ ATENÇÃO: Isto vai apagar o carro para sempre. Continuar?")) return;
    setLoading(true);

    await fetch(`/api/cars/${carId}`, {
      method: "DELETE",
    });

    // Redireciona para a lista de carros porque este já não existe
    router.push("/cars");
    router.refresh();
  };

  if (loading) return <div className="text-yellow-400 font-bold">A processar...</div>;

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6 flex flex-col gap-3">
      <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider">Painel de Admin</h3>
      <div className="flex gap-4">
        
        {/* Botão VENDER (Só aparece se estiver disponível) */}
        {isAvailable && (
          <button
            onClick={handleMarkSold}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
          >
            💰 Marcar como Vendido
          </button>
        )}

        {/* Botão APAGAR (Sempre visível) */}
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
        >
          🗑️ Apagar Viatura
        </button>
      </div>
      {!isAvailable && <p className="text-xs text-center text-green-400">Este veículo já está marcado como vendido.</p>}
    </div>
  );
}