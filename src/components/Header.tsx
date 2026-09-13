'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { data: session, status } = useSession();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <img src="/logominhafarm.png" alt="ConectLife Logo" className="h-20 w-auto" />
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
            <Link href="/map" className="text-gray-700 hover:text-green-600 transition-colors">
              Mapa
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">
              Como Funciona
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative text-gray-700 hover:text-green-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

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