"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manual" | "bulk">("manual");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Estado para formulário manual
  const [formData, setFormData] = useState({
    brand: "", model: "", year: "", price: "", fuelType: "", km: "", description: "", imageUrl: ""
  });

  // Estado para importação em massa (texto JSON)
  const [jsonInput, setJsonInput] = useState("");

  // --- HANDLER MANUAL ---
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/carsAdmin", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        images: formData.imageUrl ? [formData.imageUrl] : [] // Simples array com 1 imagem para começar
      }),
    });

    if (res.ok) {
      setMessage("✅ Carro adicionado com sucesso!");
      setFormData({ brand: "", model: "", year: "", price: "", fuelType: "", km: "", description: "", imageUrl: "" });
    } else {
      setMessage("❌ Erro ao adicionar carro.");
    }
    setLoading(false);
  };

  // --- HANDLER MASS IMPORT ---
  const handleBulkSubmit = async () => {
    try {
      setLoading(true);
      const parsedData = JSON.parse(jsonInput); // Tenta ler o JSON

      const res = await fetch("/api/carsAdmin/bulk", {
        method: "POST",
        body: JSON.stringify(parsedData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setJsonInput("");
      } else {
        setMessage(`❌ Erro: ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ JSON Inválido. Verifica a sintaxe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-500">Painel de Administração</h1>

      {message && <div className="p-4 mb-4 bg-gray-800 border border-blue-500 rounded text-center">{message}</div>}

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab("manual")}
          className={`px-4 py-2 rounded ${activeTab === "manual" ? "bg-blue-600" : "bg-gray-700"}`}
        >
          Inserir Veículo
        </button>
        <button 
          onClick={() => setActiveTab("bulk")}
          className={`px-4 py-2 rounded ${activeTab === "bulk" ? "bg-purple-600" : "bg-gray-700"}`}
        >
          Importação em Massa
        </button>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl">
        {activeTab === "manual" ? (
          <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Marca (ex: BMW)" className="p-2 bg-gray-700 rounded" required onChange={e => setFormData({...formData, brand: e.target.value})} value={formData.brand} />
            <input placeholder="Modelo (ex: Série 1)" className="p-2 bg-gray-700 rounded" required onChange={e => setFormData({...formData, model: e.target.value})} value={formData.model} />
            <input type="number" placeholder="Ano" className="p-2 bg-gray-700 rounded" required onChange={e => setFormData({...formData, year: e.target.value})} value={formData.year} />
            <input type="number" placeholder="Preço (€)" className="p-2 bg-gray-700 rounded" required onChange={e => setFormData({...formData, price: e.target.value})} value={formData.price} />
            
            <select className="p-2 bg-gray-700 rounded" onChange={e => setFormData({...formData, fuelType: e.target.value})} value={formData.fuelType} required>
              <option value="">Combustível...</option>
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Elétrico">Elétrico</option>
              <option value="Híbrido">Híbrido</option>
            </select>

            <input type="number" placeholder="KMs" className="p-2 bg-gray-700 rounded" required onChange={e => setFormData({...formData, km: e.target.value})} value={formData.km} />
            <input placeholder="URL da Imagem" className="p-2 bg-gray-700 rounded md:col-span-2" onChange={e => setFormData({...formData, imageUrl: e.target.value})} value={formData.imageUrl} />
            <textarea placeholder="Descrição..." className="p-2 bg-gray-700 rounded md:col-span-2" onChange={e => setFormData({...formData, description: e.target.value})} value={formData.description} />

            <button disabled={loading} type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 p-3 rounded font-bold">
              {loading ? "A guardar..." : "Salvar Carro"}
            </button>
          </form>
        ) : (
          <div>
            <p className="mb-2 text-gray-400">Cola aqui o JSON com a lista de carros:</p>
            <textarea 
              rows={10} 
              className="w-full p-4 bg-gray-950 font-mono text-sm rounded border border-gray-700"
              placeholder='[ { "brand": "Tesla", "model": "Model 3", "year": 2021, "price": 35000, "fuelType": "Elétrico", "km": 10000 }, ... ]'
              onChange={(e) => setJsonInput(e.target.value)}
              value={jsonInput}
            />
            <button disabled={loading} onClick={handleBulkSubmit} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 p-3 rounded font-bold">
              {loading ? "A importar..." : "Importar Lista"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}