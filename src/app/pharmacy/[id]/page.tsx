'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  openingHours: string;
  rating: number;
  logo?: string;
}

interface Medicine {
  _id: string;
  name: string;
  description?: string;
  category: string;
  dosage?: string;
  manufacturer?: string;
  requiresPrescription: boolean;
}

interface PharmacyMedicine {
  _id: string;
  medicineId: Medicine;
  price: number;
  available: boolean;
  quantity: number;
}

export default function PharmacyDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchPharmacyDetails(params.id as string);
    }
  }, [params.id]);

  const fetchPharmacyDetails = async (id: string) => {
    try {
      const [pharmacyRes, medicinesRes] = await Promise.all([
        fetch(`/api/pharmacies/${id}`),
        fetch(`/api/pharmacies/${id}/medicines`),
      ]);

      if (!pharmacyRes.ok || !medicinesRes.ok) {
        throw new Error('Erro ao carregar detalhes da farmácia');
      }

      const pharmacyData = await pharmacyRes.json();
      const medicinesData = await medicinesRes.json();

      setPharmacy(pharmacyData);
      setMedicines(medicinesData);
    } catch (err) {
      setError('Erro ao carregar detalhes da farmácia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error || 'Farmácia não encontrada'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pharmacy Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {pharmacy.name}
              </h1>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{pharmacy.address}, {pharmacy.neighborhood}, {pharmacy.city}</span>
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{pharmacy.phone}</span>
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{pharmacy.openingHours}</span>
                </p>
              </div>
            </div>

            {pharmacy.rating > 0 && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(pharmacy.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({pharmacy.rating.toFixed(1)})</span>
              </div>
            )}
          </div>
        </div>

        {/* Medicines Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Medicamentos Disponíveis
          </h2>

          {medicines.length === 0 ? (
            <p className="text-gray-600">Nenhum medicamento disponível nesta farmácia.</p>
          ) : (
            <div className="space-y-4">
              {medicines.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.medicineId.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.medicineId.category}
                      {item.medicineId.dosage && ` • ${item.medicineId.dosage}`}
                    </p>
                    {item.medicineId.requiresPrescription && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Receita necessária
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">
                    {item.available ? (
                      <>
                        <p className="text-xl font-bold text-gray-900">
                          {item.price.toLocaleString('pt-MZ')} MT
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantidade: {item.quantity}
                        </p>
                        {session ? (
                          <button
                            onClick={() => {
                              // TODO: Implement add to order functionality
                              console.log('Add to order:', item.medicineId.name);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Adicionar ao Pedido
                          </button>
                        ) : (
                          <Link
                            href="/login"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Entrar para Pedir
                          </Link>
                        )}
                      </>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Indisponível
                      </span>
                    )}
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