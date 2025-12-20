"use client";

// 1. Esta linha resolve o erro do Build na Vercel
export const dynamic = "force-dynamic";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const errorUrl = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou password incorretos.");
    } else {
      router.push("/admin/dashboard"); 
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-500">Stand Automóvel</h1>
        
        <div className="bg-yellow-900/30 border border-yellow-600 p-3 rounded-lg mb-6 text-sm text-yellow-200">
          <p className="font-bold">🎓 Acesso Admin:</p>
          <p>Email: admin@stand.com | Pass: admin123</p>
        </div>

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
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 text-white"
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
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white p-4">
      <Suspense fallback={<div className="text-white">A carregar...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}