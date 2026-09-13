'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PharmacyDashboardNav from '@/components/PharmacyDashboardNav';

interface OrderItem {
  medicineName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'received' | 'analyzing' | 'confirmed' | 'ready' | 'completed' | 'rejected';
  rejectionReason?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  isGuestOrder?: boolean;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  user?: {
    name: string;
    phone?: string;
  };
}

export default function PharmacyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/pharmacies/my-pharmacy/orders');
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

  const handleUpdateStatus = async (orderId: string, newStatus: string, rejectionReason?: string) => {
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/pharmacies/my-pharmacy/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, rejectionReason }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Status do pedido atualizado para ${statusLabels[newStatus as keyof typeof statusLabels]}`);
        fetchOrders();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Erro ao atualizar status do pedido');
      }
    } catch (error) {
      setError('Erro ao atualizar status do pedido');
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

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

  if (loading) {
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
      <PharmacyDashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestão de Pedidos
          </h1>
          <p className="text-gray-600">
            Visualize e gerencie os pedidos recebidos
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'received', 'analyzing', 'confirmed', 'ready', 'completed', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'Todos' : statusLabels[status as keyof typeof statusLabels]}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-gray-600">
              {filter === 'all' ? 'Ainda não recebeu nenhum pedido' : `Nenhum pedido com status "${statusLabels[filter as keyof typeof statusLabels]}"`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pt-MZ')} às {new Date(order.createdAt).toLocaleTimeString('pt-MZ')}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-900">{item.medicineName}</span>
                          <span className="text-gray-600">
                            {item.quantity}x {item.price.toLocaleString('pt-MZ')} MT
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>{order.totalAmount.toLocaleString('pt-MZ')} MT</span>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Nota:</span> {order.notes}
                        </p>
                      </div>
                    )}

                    {order.deliveryMethod === 'delivery' && order.deliveryAddress && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Entrega:</span> {order.deliveryAddress}
                        </p>
                      </div>
                    )}

                    {order.isGuestOrder && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Cliente Convidado:</span> {order.guestName}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Telefone:</span> {order.guestPhone}
                        </p>
                        {order.guestEmail && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span> {order.guestEmail}
                          </p>
                        )}
                      </div>
                    )}

                    {order.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">
                          <span className="font-medium">Motivo da recusa:</span> {order.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'received')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Receber Pedido
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Motivo da recusa:');
                            if (reason) handleUpdateStatus(order._id, 'rejected', reason);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Recusar
                        </button>
                      </>
                    )}

                    {order.status === 'received' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'analyzing')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        Iniciar Análise
                      </button>
                    )}

                    {order.status === 'analyzing' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Motivo da recusa:');
                            if (reason) handleUpdateStatus(order._id, 'rejected', reason);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Recusar
                        </button>
                      </>
                    )}

                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'ready')}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                      >
                        Marcar como Pronto
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'completed')}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        Concluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}