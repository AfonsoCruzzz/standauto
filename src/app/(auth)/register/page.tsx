"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        role: "ADMIN" 
      }),
    });

    if (res.ok) {
      router.push("/login"); // Manda para o login após sucesso
    } else {
      const data = await res.json();
      setError(data.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-800 rounded-lg">
        <h1 className="text-2xl mb-6 font-bold text-center">Criar Conta </h1>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <input
          type="text"
          placeholder="Nome"
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-6 bg-gray-700 rounded border border-gray-600"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        
        <button type="submit" className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700 font-bold">
          Registar
        </button>
        <div className="mt-6 text-center text-sm text-gray-500">
          Já tens conta?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}