"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, FileJson, ArrowLeft, CheckCircle } from "lucide-react";

export default function NewCarPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"manual" | "json">("manual");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- ESTADO DO FORMULÁRIO MANUAL ---
  const [formData, setFormData] = useState({
    brand: "", model: "", submodel: "", segment: "",
    year: new Date().getFullYear(), price: 0, km: 0,
    fuelType: "Gasolina", transmission: "Manual",
    power: 0, engineSize: 0, condition: "Usado", warranty: "",
    description: "", images: "", isFeatured: false
  });

  // --- ESTADO DO JSON ---
  const [jsonInput, setJsonInput] = useState("");

  // --- SUBMIT MANUAL ---
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Converter string de imagens em array
    const imagesArray = formData.images.split(",").map(s => s.trim()).filter(s => s !== "");

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          price: Number(formData.price),
          km: Number(formData.km),
          power: Number(formData.power),
          engineSize: Number(formData.engineSize),
          images: imagesArray.length > 0 ? imagesArray : ["/placeholder.jpg"]
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar carro");
      
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      setMessage("Erro ao criar. Verifica os campos.");
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT JSON (MASSA) ---
  const handleJsonSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const parsedData = JSON.parse(jsonInput);
      
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });

      if (!res.ok) throw new Error("Erro na importação");

      const data = await res.json();
      setMessage(`Sucesso! ${data.count || 1} viaturas importadas.`);
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 1500);
    } catch (error) {
      setMessage("JSON Inválido ou Erro no Servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 pb-20">
      <button onClick={() => router.back()} className="text-gray-400 hover:text-white mb-6 flex items-center gap-2">
        <ArrowLeft size={20} /> Voltar ao Dashboard
      </button>

      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
        
        {/* --- ABAS / TABS --- */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 p-4 font-bold text-center transition ${
              activeTab === "manual" ? "bg-blue-600 text-white" : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            📝 Adicionar Individual
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`flex-1 p-4 font-bold text-center transition ${
              activeTab === "json" ? "bg-purple-600 text-white" : "hover:bg-gray-800 text-gray-400"
            }`}
          >
            {<FileJson className="inline mr-2"/>} Importar JSON (Massa)
          </button>
        </div>

        <div className="p-8">
          {message && (
            <div className={`p-4 mb-6 rounded text-center ${message.includes("Sucesso") ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
              {message}
            </div>
          )}

          {/* --- CONTEÚDO: MANUAL --- */}
          {activeTab === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-xs text-gray-400 mb-1">Marca</label><input required className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="Ex: BMW" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Modelo</label><input required className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} placeholder="Ex: Série 1" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Sub-modelo (Versão)</label><input className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.submodel} onChange={e => setFormData({...formData, submodel: e.target.value})} placeholder="Ex: 116d Pack M" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Segmento</label><input className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.segment} onChange={e => setFormData({...formData, segment: e.target.value})} placeholder="Ex: Hatchback" /></div>
                
                <div><label className="block text-xs text-gray-400 mb-1">Preço (€)</label><input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Quilómetros</label><input type="number" required className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.km} onChange={e => setFormData({...formData, km: Number(e.target.value)})} /></div>
                
                <div><label className="block text-xs text-gray-400 mb-1">Combustível</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.fuelType} onChange={e => setFormData({...formData, fuelType: e.target.value})}>
                    <option>Gasolina</option><option>Diesel</option><option>Elétrico</option><option>Híbrido</option><option>GPL</option>
                  </select>
                </div>
                <div><label className="block text-xs text-gray-400 mb-1">Caixa</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
                    <option>Manual</option><option>Automática</option>
                  </select>
                </div>
                
                <div><label className="block text-xs text-gray-400 mb-1">Imagens (Links separados por vírgula)</label><input className="w-full bg-gray-800 border border-gray-700 rounded p-2" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="/car1.jpg, /car2.jpg" /></div>
              </div>
              
              <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold flex justify-center items-center gap-2">
                {loading ? "A guardar..." : <><Save size={18}/> Guardar Viatura</>}
              </button>
            </form>
          )}

          {/* --- CONTEÚDO: JSON (MASSA) --- */}
          {activeTab === "json" && (
            <div className="space-y-4">
              <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded text-sm text-yellow-200">
                <p className="font-bold">⚠️ Instruções:</p>
                <p>Cola aqui uma lista de objetos JSON. Garante que os nomes dos campos (brand, model, price, etc.) estão em inglês e iguais ao Schema.</p>
              </div>
              
              <textarea
                rows={12}
                className="w-full bg-gray-800 border border-gray-700 rounded p-4 font-mono text-xs text-green-400"
                placeholder={`[
                            {
                                "brand": "Ford",
                                "model": "Focus",
                                "price": 25000,
                                "year": 2023,
                                "km": 10000,
                                "fuelType": "Gasolina",
                                "transmission": "Manual",
                                "power": 125,
                                "engineSize": 999,
                                "images": ["/ford.jpg"]
                            },
                            { ... }
                            ]`}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
              />

              <button 
                onClick={handleJsonSubmit}
                disabled={loading} 
                className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded font-bold flex justify-center items-center gap-2"
              >
                {loading ? "A processar..." : <><CheckCircle size={18}/> Importar Lista JSON</>}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}