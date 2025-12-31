"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCarPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'manual' | 'json'>('manual');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    submodel: "",
    segment: "Utilitário",
    price: "",
    km: "",
    year: "",
    fuelType: "Gasóleo",
    transmission: "Manual",
    color: "",
    power: "",
    doors: "5",
    seats: "5",
    warranty: "18 Meses", // <--- NOVO
    description: "",
    images: "", 
  });

  const [jsonInput, setJsonInput] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        km: parseInt(formData.km),
        year: parseInt(formData.year),
        power: formData.power ? parseInt(formData.power) : null,
        doors: formData.doors ? parseInt(formData.doors) : null,
        seats: formData.seats ? parseInt(formData.seats) : null,
        images: formData.images.split(",").map((url) => url.trim()).filter((url) => url !== ""),
      };

      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar viatura.");

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Falha ao guardar. Verifica os campos.");
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setError("");

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (e) {
        throw new Error("JSON inválido.");
      }

      if (!Array.isArray(parsedData)) parsedData = [parsedData];

      let successCount = 0;
      for (const car of parsedData) {
        const payload = {
            ...car,
            price: Number(car.price),
            km: Number(car.km),
            year: Number(car.year),
            power: car.power ? Number(car.power) : null,
            doors: car.doors ? Number(car.doors) : 5,    // <--- NOVO
            seats: car.seats ? Number(car.seats) : 5,    // <--- NOVO
            warranty: car.warranty || "Sob Consulta",    // <--- NOVO
            images: Array.isArray(car.images) ? car.images : [],
            isAvailable: true,
            isFeatured: false
        };

        const res = await fetch("/api/cars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) successCount++;
      }

      setSuccessMsg(`Importação concluída! ${successCount} carros importados.`);
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-950 min-h-screen text-white flex justify-center">
      <div className="w-full max-w-4xl bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
        
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-500">Adicionar Viaturas</h1>
            <div className="flex bg-gray-800 rounded-lg p-1">
                <button onClick={() => setActiveTab('manual')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'manual' ? 'bg-blue-600' : 'text-gray-400'}`}>Manual</button>
                <button onClick={() => setActiveTab('json')} className={`px-4 py-2 rounded-md text-sm font-bold transition ${activeTab === 'json' ? 'bg-blue-600' : 'text-gray-400'}`}>Importar JSON</button>
            </div>
        </div>

        {error && <div className="bg-red-900/50 text-red-200 p-4 rounded mb-6 border border-red-500">{error}</div>}
        {successMsg && <div className="bg-green-900/50 text-green-200 p-4 rounded mb-6 border border-green-500">{successMsg}</div>}

        {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              
              {/* Identificação */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-300">🚙 Identificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">Marca *</label><input required name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Modelo *</label><input required name="model" value={formData.model} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Versão</label><input name="submodel" value={formData.submodel} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                </div>
              </div>

              {/* Dados Técnicos */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-300">⚙️ Dados Técnicos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><label className="block text-sm text-gray-400 mb-1">Preço (€) *</label><input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Ano *</label><input required type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">KM *</label><input required type="number" name="km" value={formData.km} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                  <div><label className="block text-sm text-gray-400 mb-1">Potência (cv)</label><input type="number" name="power" value={formData.power} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Combustível</label>
                    <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600">
                      <option>Gasóleo</option><option>Gasolina</option><option>Elétrico</option><option>Híbrido (PHEV)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Caixa</label>
                    <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600">
                      <option>Manual</option><option>Automática</option>
                    </select>
                  </div>
                  <div><label className="block text-sm text-gray-400 mb-1">Cor</label><input name="color" value={formData.color} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Garantia</label>
                    <input name="warranty" value={formData.warranty} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" placeholder="Ex: 18 Meses" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div><label className="block text-sm text-gray-400 mb-1">Portas</label><input type="number" name="doors" value={formData.doors} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                    <div><label className="block text-sm text-gray-400 mb-1">Lugares</label><input type="number" name="seats" value={formData.seats} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded border border-gray-600" /></div>
                </div>
              </div>

              {/* Imagens */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold mb-4 text-gray-300">📷 Detalhes</h3>
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1">Imagens (URLs separados por vírgula)</label>
                  <textarea name="images" value={formData.images} onChange={handleChange} rows={3} className="w-full p-2 bg-gray-800 rounded border border-gray-600 text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-2 bg-gray-800 rounded border border-gray-600" />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition disabled:opacity-50">{loading ? "Guardar..." : "Criar Viatura"}</button>
              </div>
            </form>
        )}

        {activeTab === 'json' && (
            <form onSubmit={handleJsonSubmit} className="space-y-6">
                <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg text-sm text-yellow-200">
                    <p>Estrutura JSON (Agora com Garantia, Cor, Portas):</p>
                    <pre className="bg-black/50 p-3 rounded mt-2 overflow-x-auto font-mono text-xs text-gray-300">
                        {`[{
                        "brand": "BMW", "model": "X5", "price": 85000, "year": 2023, "km": 15000,
                        "fuelType": "Gasóleo", "transmission": "Automática", "color": "Preto",
                        "power": 286, "doors": 5, "seats": 5, "warranty": "24 Meses",
                        "images": ["url1", "url2"]
                        }]`}
                    </pre>
                </div>
                <textarea value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} rows={15} className="w-full p-4 bg-gray-800 rounded-lg border border-gray-600 font-mono text-sm" placeholder='Colar JSON aqui...' required />
                <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition">{loading ? "A Importar..." : "Importar Carros"}</button>
            </form>
        )}

      </div>
    </div>
  );
}