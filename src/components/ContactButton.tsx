"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ContactButton({ carTitle }: { carTitle: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleContact = () => {
    if (!session) {
      // Se não estiver logado, redireciona para login
      router.push("/login?error=ContactAuthRequired");
      return;
    }
    // Se estiver logado, abre o email
    window.location.href = `mailto:geral@standauto.com?subject=Interesse em: ${carTitle}`;
  };

  return (
    <button
      onClick={handleContact}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg transition shadow-lg flex items-center justify-center gap-2"
    >
      Tenho Interesse / Agendar Test-Drive
    </button>
  );
}