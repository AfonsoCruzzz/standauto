import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stand Automóvel - Os Melhores Carros',
  description: 'Encontre o carro perfeito no nosso stand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <Providers>
          {/* A Navbar fica aqui, visível em todas as páginas */}
          <Navbar /> 
          
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}