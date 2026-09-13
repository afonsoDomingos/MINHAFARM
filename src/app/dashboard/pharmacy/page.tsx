'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PharmacyDashboardNav from '@/components/PharmacyDashboardNav';

export default function PharmacyDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [stats, setStats] = useState({
    totalMedicines: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/pharmacy-login');
    } else if (status === 'authenticated' && (session?.user as any).role !== 'pharmacy') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchPharmacyData();
      fetchStats();
    }
  }, [status, session, router]);

  const fetchPharmacyData = async () => {
    try {
      const response = await fetch('/api/pharmacies/my-pharmacy');
      if (response.ok) {
        const data = await response.json();
        setPharmacy(data);
      }
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/pharmacies/my-pharmacy/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
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
      <PharmacyDashboardNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Painel da Farmácia
          </h1>
          <p className="text-gray-600">
            {pharmacy?.name || 'A sua farmácia'}
          </p>
        </div>

        {pharmacy?.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">A sua farmácia está em análise</p>
            <p className="text-sm mt-1">
              Aguarde a aprovação do administrador para começar a usar a plataforma.
            </p>
          </div>
        )}

        {pharmacy?.status === 'suspended' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">A sua farmácia está suspensa</p>
            <p className="text-sm mt-1">
              Contacte o suporte para mais informações.
            </p>
          </div>
        )}

        {pharmacy?.status === 'approved' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medicamentos</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalMedicines}</p>
                <p className="text-sm text-gray-600 mt-1">Cadastrados</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pedidos</h3>
                <p className="text-3xl font-bold text-green-600">{stats.pendingOrders}</p>
                <p className="text-sm text-gray-600 mt-1">Pendentes</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Concluídos</h3>
                <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                <p className="text-sm text-gray-600 mt-1">Este mês</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/pharmacy/medicines"
                    className="block w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    + Adicionar Medicamento
                  </Link>
                  <Link
                    href="/dashboard/pharmacy/orders"
                    className="block w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    📋 Ver Pedidos
                  </Link>
                  <Link
                    href="/dashboard/pharmacy/settings"
                    className="block w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    ⚙️ Editar Informações
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Farmácia</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Endereço:</span> {pharmacy.address}</p>
                  <p><span className="font-medium">Bairro:</span> {pharmacy.neighborhood}</p>
                  <p><span className="font-medium">Cidade:</span> {pharmacy.city}</p>
                  <p><span className="font-medium">Telefone:</span> {pharmacy.phone}</p>
                  <p><span className="font-medium">Horário:</span> {pharmacy.openingHours}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}