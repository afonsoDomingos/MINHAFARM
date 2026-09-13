'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any).role !== 'user') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/users/my-orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    received: 'bg-blue-100 text-blue-800',
    analyzing: 'bg-purple-100 text-purple-800',
    confirmed: 'bg-green-100 text-green-800',
    ready: 'bg-teal-100 text-teal-800',
    completed: 'bg-gray-100 text-gray-800',
    rejected: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    received: 'Recebido',
    analyzing: 'Em Análise',
    confirmed: 'Confirmado',
    ready: 'Pronto',
    completed: 'Concluído',
    rejected: 'Recusado',
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Minha Conta
          </h1>
          <p className="text-gray-600">
            Bem-vindo, {session?.user?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pedidos Totais</h3>
            <p className="text-3xl font-bold text-green-600">{orders.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pedidos Ativos</h3>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter(o => !['completed', 'rejected'].includes(o.status)).length}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Concluídos</h3>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Histórico de Pedidos</h2>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum pedido ainda
              </h3>
              <p className="text-gray-600 mb-4">
                Comece pesquisando medicamentos e fazendo pedidos
              </p>
              <a
                href="/search"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Pesquisar Medicamentos
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                          {statusLabels[order.status as keyof typeof statusLabels]}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('pt-MZ')} às {new Date(order.createdAt).toLocaleTimeString('pt-MZ')}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-900">{item.medicineName}</span>
                            <span className="text-gray-600">
                              {item.quantity}x {item.price.toLocaleString('pt-MZ')} MT
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total:</span>
                          <span>{order.totalAmount.toLocaleString('pt-MZ')} MT</span>
                        </div>
                      </div>

                      {order.pharmacyId && (
                        <p className="text-sm text-gray-600 mt-2">
                          Farmácia: {order.pharmacyId.name}
                        </p>
                      )}

                      {order.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 rounded">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Motivo da recusa:</span> {order.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}