'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const deliveryMethod = searchParams.get('delivery') || 'pickup';
  const total = searchParams.get('total') || '0';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pedido Enviado!
          </h1>
          <p className="text-gray-600 mb-6">
            Seu pedido foi enviado com sucesso para a farmácia.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">Detalhes do Pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Método de Entrega:</span>
                <span className="font-medium text-gray-900">
                  {deliveryMethod === 'delivery' ? 'Entrega em Casa' : 'Levantar na Farmácia'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-yellow-600">Pendente</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-gray-900 mb-2">O que acontece agora?</h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• A farmácia receberá seu pedido</li>
              <li>• A farmácia analisará a disponibilidade</li>
              <li>• Você será notificado quando o pedido for confirmado</li>
              <li>• Se selecionou entrega, a farmácia entrará em contato</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
            >
              Voltar à Página Inicial
            </Link>
            <Link
              href="/pharmacies"
              className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
            >
              Ver Outras Farmácias
            </Link>
          </div>

          {/* Note for Guest Users */}
          <p className="mt-6 text-xs text-gray-500">
            {searchParams.get('guest') === 'true' && (
              <span>Dica: Crie uma conta para ver seus pedidos anteriores e rastrear seus pedidos.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">A carregar...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
