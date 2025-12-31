"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/cars?keyword=${encodeURIComponent(term)}`);
    } else {
      router.push("/cars");
    }
  };

  return (
    <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="O que procura? Ex: BMW X5, Tesla..."
        className="flex-1 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-blue-500 transition shadow-xl"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button
        type="submit"
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl transition transform hover:scale-105"
      >
        Pesquisar
      </button>
    </form>
  );
}