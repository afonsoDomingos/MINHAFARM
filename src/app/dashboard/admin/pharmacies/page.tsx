'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminPharmaciesPage() {
  const { data: session } = useSession();
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await fetch('/api/admin/pharmacies');
      if (response.ok) {
        const data = await response.json();
        setPharmacies(data);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (pharmacyId: string) => {
    if (!confirm('Tem certeza que deseja aprovar esta farmácia?')) return;

    try {
      const response = await fetch(`/api/admin/pharmacies/${pharmacyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        fetchPharmacies();
      }
    } catch (error) {
      console.error('Error approving pharmacy:', error);
    }
  };

  const handleSuspend = async (pharmacyId: string) => {
    if (!confirm('Tem certeza que deseja suspender esta farmácia?')) return;

    try {
      const response = await fetch(`/api/admin/pharmacies/${pharmacyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'suspended' }),
      });

      if (response.ok) {
        fetchPharmacies();
      }
    } catch (error) {
      console.error('Error suspending pharmacy:', error);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
  };

  const statusLabels = {
    pending: 'Pendente',
    approved: 'Aprovada',
    suspended: 'Suspensa',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerir Farmácias
          </h1>
          <p className="text-gray-600">
            Aprovar ou suspender farmácias cadastradas
          </p>
        </div>

        {pharmacies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">Nenhuma farmácia cadastrada</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pharmacies.map((pharmacy) => (
                  <tr key={pharmacy._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pharmacy.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{pharmacy.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {pharmacy.neighborhood}, {pharmacy.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[pharmacy.status as keyof typeof statusColors]}`}>
                        {statusLabels[pharmacy.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {pharmacy.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(pharmacy._id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Aprovar
                        </button>
                      )}
                      {pharmacy.status === 'approved' && (
                        <button
                          onClick={() => handleSuspend(pharmacy._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Suspender
                        </button>
                      )}
                      {pharmacy.status === 'suspended' && (
                        <button
                          onClick={() => handleApprove(pharmacy._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Reativar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}