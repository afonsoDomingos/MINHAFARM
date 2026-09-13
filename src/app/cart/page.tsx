'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, getPharmacyGroupedItems } = useCart();
  const pharmacyGroupedItems = getPharmacyGroupedItems();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Carrinho Vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Não há medicamentos no seu carrinho
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Pesquisar Medicamentos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carrinho de Compras
          </h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <div className="space-y-6">
          {Object.entries(pharmacyGroupedItems).map(([pharmacyId, pharmacyItems]) => (
            <div key={pharmacyId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {pharmacyItems[0].pharmacyName}
              </h2>
              <div className="space-y-4">
                {pharmacyItems.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.medicineName}
                      </h3>
                      <p className="text-gray-600">
                        {item.price.toLocaleString('pt-MZ')} MT por unidade
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-lg font-semibold text-gray-900 min-w-[120px] text-right">
                        {(item.price * item.quantity).toLocaleString('pt-MZ')} MT
                      </p>

                      <button
                        onClick={() => removeFromCart(item.medicineId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">
                  {pharmacyItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('pt-MZ')} MT
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900">Total</span>
            <span className="text-3xl font-bold text-gray-900">
              {getCartTotal().toLocaleString('pt-MZ')} MT
            </span>
          </div>

          <Link
            href="/checkout"
            className="w-full flex justify-center py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Finalizar Pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
