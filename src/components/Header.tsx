'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img src="/MinhaFarm.png" alt="MINHAFARM Logo" className="h-10 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Início
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-green-600 transition-colors">
              Encontrar Medicamento
            </Link>
            <Link href="/pharmacies" className="text-gray-700 hover:text-green-600 transition-colors">
              Farmácias
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">
              Como Funciona
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <>
                {(session.user as any).role === 'pharmacy' && (
                  <Link
                    href="/dashboard/pharmacy"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Painel
                  </Link>
                )}
                {(session.user as any).role === 'admin' && (
                  <Link
                    href="/dashboard/admin"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                {(session.user as any).role === 'user' && (
                  <Link
                    href="/dashboard/user"
                    className="text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Minha Conta
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}