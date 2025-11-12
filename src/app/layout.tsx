import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stand Automóvel - Os Melhores Carros',
  description: 'Encontre o carro perfeito no nosso stand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Stand Automóvel</h1>
              <div className="space-x-4">
                <a href="/" className="hover:text-blue-200 transition-colors">
                  Início
                </a>
                <a href="/cars" className="hover:text-blue-200 transition-colors">
                  Carros
                </a>
                <a href="/contact" className="hover:text-blue-200 transition-colors">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white p-8 mt-12">
          <div className="container mx-auto text-center">
            <p>&copy; 2025 Stand Automóvel. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}