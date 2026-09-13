'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { symptoms } from '@/data/symptoms';
import { useCart } from '@/contexts/CartContext';

interface SearchResult {
  _id: string;
  medicineId: string;
  name: string;
  pharmacy: {
    _id: string;
    name: string;
    address: string;
    neighborhood: string;
    city: string;
  };
  available: boolean;
  price: number;
  quantity: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart } = useCart();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'name' | 'symptom'>('name');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (query) {
      searchMedicines(query);
    }
  }, [query]);

  const searchMedicines = async (searchQuery: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.error || 'Erro ao buscar medicamentos';
        const errorDetails = data.details ? ` (${data.details})` : '';
        setError(errorMessage + errorDetails);
        console.error('Search error:', data);
        return;
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Erro ao buscar medicamentos. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomSearch = (symptomId: string) => {
    const symptom = symptoms.find((s) => s.id === symptomId);
    if (symptom) {
      const params = new URLSearchParams();
      params.set('q', symptom.suggestedMedicines[0]);
      params.set('filter', 'symptom');
      window.location.href = `/search?${params.toString()}`;
    }
  };

  const handleAddToCart = (result: SearchResult) => {
    addToCart({
      pharmacyId: result.pharmacy._id,
      pharmacyName: result.pharmacy.name,
      medicineId: result.medicineId || result._id,
      medicineName: result.name,
      price: result.price,
    });
    setToastMessage(`${result.name} adicionado ao carrinho`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Busca de Medicamentos
          </h1>
          <p className="text-gray-600">
            {query ? `Resultados para "${query}"` : 'Encontre o medicamento que precisa'}
          </p>
        </div>

        {/* Filter Type Selector */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Tipo de filtro:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('name')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'name'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Nome
              </button>
              <button
                onClick={() => setFilterType('symptom')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'symptom'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Sintoma
              </button>
            </div>
          </div>

          {filterType === 'symptom' && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">Selecione o que está sentindo:</p>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => handleSymptomSearch(symptom.id)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  >
                    {symptom.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filterType === 'name' && (
            <div className="mt-4">
              <Link
                href="/"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Voltar à página inicial para buscar por nome
              </Link>
            </div>
          )}
        </div>

        {/* Results Section */}
        {query && (
          <div className="mb-8">
            <p className="text-gray-600">
              {results.length} {results.length === 1 ? 'farmácia encontrada' : 'farmácias encontradas'}
            </p>
          </div>
        )}

        {!query && filterType === 'name' && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Selecione o tipo de filtro ou vá para a página inicial para buscar medicamentos
            </p>
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Voltar à página inicial
            </Link>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">A buscar medicamentos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && query && filterType === 'name' && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Medicamento não disponível
            </h3>
            <p className="text-gray-600 mb-4">
              Este medicamento não está disponível nas farmácias cadastradas ou não existe no sistema.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Possíveis motivos:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• O medicamento acabou nas farmácias</li>
                <li>• O medicamento ainda não foi cadastrado no sistema</li>
                <li>• Tente pesquisar pelo nome genérico do medicamento</li>
              </ul>
            </div>
            <div className="mt-6 space-x-4">
              <Link
                href="/"
                className="inline-block text-green-600 hover:text-green-700 font-medium"
              >
                Voltar à página inicial
              </Link>
              <Link
                href="/pharmacies"
                className="inline-block text-green-600 hover:text-green-700 font-medium"
              >
                Ver todas as farmácias
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid gap-6">
            {results.map((result) => (
              <div
                key={result._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {result.name}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        <span className="font-medium">Farmácia:</span> {result.pharmacy.name}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Localização:</span> {result.pharmacy.neighborhood}, {result.pharmacy.city}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Endereço:</span> {result.pharmacy.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">
                    <div className="flex items-center gap-2">
                      {result.available ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ✓ Disponível
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          ✕ Indisponível
                        </span>
                      )}
                    </div>

                    {result.available && (
                      <>
                        <p className="text-2xl font-bold text-gray-900">
                          {result.price.toLocaleString('pt-MZ')} MT
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantidade: {result.quantity}
                        </p>
                        <div className="flex gap-2">
                          <Link
                            href={`/pharmacy/${result.pharmacy._id}`}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Ver Farmácia
                          </Link>
                          <button
                            onClick={() => handleAddToCart(result)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Adicionar ao Pedido
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">A carregar...</p>
      </div>
    </div>}>
      <SearchContent />
    </Suspense>
  );
}