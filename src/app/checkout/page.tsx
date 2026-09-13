'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';

const DELIVERY_FEE = 100; // Taxa fixa de entrega em MT

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, getCartTotal, getPharmacyGroupedItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [mounted, setMounted] = useState(false);

  const pharmacyGroupedItems = getPharmacyGroupedItems();
  const totalWithDelivery = getCartTotal() + (deliveryMethod === 'delivery' ? DELIVERY_FEE : 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!session) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (deliveryMethod === 'delivery' && !deliveryAddress.trim()) {
      setError('Por favor, forneça o endereço de entrega');
      return;
    }

    setLoading(true);

    try {
      // Create one order per pharmacy
      const orderPromises = Object.entries(pharmacyGroupedItems).map(
        ([pharmacyId, pharmacyItems]) => {
          const orderItems = pharmacyItems.map((item) => ({
            medicineId: item.medicineId,
            medicineName: item.medicineName,
            quantity: item.quantity,
            price: item.price,
          }));

          const subtotal = pharmacyItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );
          const totalAmount = subtotal + (deliveryMethod === 'delivery' ? DELIVERY_FEE : 0);

          return fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pharmacyId,
              items: orderItems,
              totalAmount,
              deliveryMethod,
              deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
              notes,
            }),
          });
        }
      );

      const responses = await Promise.all(orderPromises);

      if (responses.every((res) => res.ok)) {
        clearCart();
        router.push('/dashboard/user?order_placed=true');
      } else {
        setError('Erro ao criar pedido. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao criar pedido. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Pedido
          </h1>
          <p className="text-gray-600">
            Revise os itens e escolha o método de entrega
          </p>
          {!session && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="font-medium">Faça login para finalizar o pedido</p>
              <p className="text-sm mt-1">
                Você precisa estar logado para concluir o pedido. Seus itens estão salvos no carrinho.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resumo do Pedido
            </h2>
            <div className="space-y-4">
              {Object.entries(pharmacyGroupedItems).map(([pharmacyId, pharmacyItems]) => (
                <div key={pharmacyId} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {pharmacyItems[0].pharmacyName}
                  </h3>
                  <div className="space-y-2">
                    {pharmacyItems.map((item) => (
                      <div
                        key={item.medicineId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {item.medicineName} x{item.quantity}
                        </span>
                        <span className="text-gray-900">
                          {(item.price * item.quantity).toLocaleString('pt-MZ')} MT
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  {getCartTotal().toLocaleString('pt-MZ')} MT
                </span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxa de Entrega</span>
                  <span className="text-gray-900">
                    {DELIVERY_FEE.toLocaleString('pt-MZ')} MT
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xl font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {totalWithDelivery.toLocaleString('pt-MZ')} MT
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Método de Entrega
            </h2>
            <div className="space-y-4">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={(e) => setDeliveryMethod(e.target.value as 'pickup' | 'delivery')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    Levantar na Farmácia
                  </span>
                  <span className="block text-sm text-gray-500">
                    Vá à farmácia para levantar o seu pedido
                  </span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={(e) => setDeliveryMethod(e.target.value as 'pickup' | 'delivery')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    Entrega em Casa
                  </span>
                  <span className="block text-sm text-gray-500">
                    Receba o pedido no seu endereço (+{DELIVERY_FEE.toLocaleString('pt-MZ')} MT)
                  </span>
                </div>
              </label>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="mt-4">
                <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço de Entrega *
                </label>
                <textarea
                  id="deliveryAddress"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="Av. Julius Nyerere, 123, Maputo"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notas Adicionais (Opcional)
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Instruções especiais ou informações adicionais"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Voltar
            </button>
            {!session ? (
              <button
                type="button"
                onClick={() => router.push('/login?redirect=/checkout')}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Fazer Login
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'A processar...' : 'Confirmar Pedido'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
