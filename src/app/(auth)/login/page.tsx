"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorUrl = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // O signIn do NextAuth trata de tudo.
    // redirect: false permite-nos controlar o que acontece a seguir (mostrar erro ou mudar de página)
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou password incorretos.");
    } else {
      // Sucesso! Vamos para a dashboard de admin ou para a home
      router.push("/"); // Ou router.push("/")
      router.refresh(); // Atualiza a sessão no lado do cliente
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-500">Stand Automóvel</h1>
        <p className="text-center text-gray-400 mb-8">Login Administrativo / Cliente</p>
        <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded-lg mb-6 text-sm text-yellow-200">
            <p className="font-bold"> Dados do Admin para teste:</p>
            <p>Email: <span className="font-mono bg-black/30 px-1 rounded">admin@stand.com</span></p>
            <p>Pass: <span className="font-mono bg-black/30 px-1 rounded">admin123</span></p>
        </div>

        {/* Mensagens de Erro vindas do URL (ex: Middleware) */}
        {errorUrl === "CredentialsSignin" && (
           <div className="p-3 mb-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
             Credenciais inválidas.
           </div>
        )}

        {error && (
          <div className="p-3 mb-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="exemplo@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Ainda não tens conta?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}