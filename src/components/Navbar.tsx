"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo / Home */}
        <Link href="/" className="text-xl font-bold text-blue-500 hover:text-blue-400">
          Stand Automóvel
        </Link>

        <div className="flex items-center gap-6">
          {/* Link: Carros (Público) */}
          <Link href="/cars" className="text-gray-300 hover:text-white transition">
            Ver Carros
          </Link>

          {/* --- ZONA ADMIN (Só aparece se for ADMIN) --- */}
          {session?.user?.role === "ADMIN" && (
            <>
              <Link 
                href="/admin/dashboard" 
                className="text-yellow-500 hover:text-yellow-400 font-medium transition"
              >
                Painel Admin
              </Link>
              
              <Link 
                href="/admin/strategy" 
                className="text-blue-500 hover:text-blue-400 font-medium transition"
              >
                Estratégia (SAD)
              </Link>
            </>
          )}

          {/* --- ZONA DE LOGIN / LOGOUT --- */}
          {session ? (
            <div className="flex items-center gap-4 border-l border-gray-700 pl-4 ml-2">
              <span className="text-sm text-gray-400 hidden md:block">
                Olá, {session.user.name || "Utilizador"}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-medium"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}