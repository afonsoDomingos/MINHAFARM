'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { symptoms } from '@/data/symptoms';
import { useCart } from '@/contexts/CartContext';
import { productCategories } from '@/data/categories';

interface PharmacyOption {
  pharmacyId: string;
  pharmacyName: string;
  address: string;
  neighborhood: string;
  city: string;
  price: number;
  quantity: number;
  available: boolean;
  _id: string;
  medicineId: string;
}

interface SearchResult {
  _id: string;
  medicineId: string;
  name: string;
  category?: string;
  pharmacies: PharmacyOption[];
  lowestPrice: number;
  highestPrice: number;
  pharmacyCount: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart } = useCart();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'name' | 'symptom' | 'category'>('name');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
        throw new Error('Erro ao buscar medicamentos');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError('Erro ao buscar medicamentos. Tente novamente.');
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

  const handleCategorySearch = (category: string) => {
    const params = new URLSearchParams();
    params.set('q', category);
    params.set('filter', 'category');
    window.location.href = `/search?${params.toString()}`;
  };

  const handleAddToCart = (result: SearchResult, pharmacyOption: PharmacyOption) => {
    addToCart({
      pharmacyId: pharmacyOption.pharmacyId,
      pharmacyName: pharmacyOption.pharmacyName,
      medicineId: pharmacyOption.medicineId || pharmacyOption._id,
      medicineName: result.name,
      price: pharmacyOption.price,
    });
    setToastMessage(`${result.name} adicionado ao carrinho de ${pharmacyOption.pharmacyName}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Busca de Produtos
          </h1>
          <p className="text-gray-600">
            {query ? `Resultados para "${query}"` : 'Encontre o produto que precisa'}
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
              <button
                onClick={() => setFilterType('category')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'category'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Categoria
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

          {filterType === 'category' && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">Selecione uma categoria:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {productCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategorySearch(category.name)}
                    className="px-4 py-3 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-left"
                  >
                    {category.name}
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
              Selecione o tipo de filtro ou vá para a página inicial para buscar produtos
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
            <p className="mt-4 text-gray-600">A buscar produtos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (filterType === 'name' || filterType === 'category') && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Produto não disponível
            </h3>
            <p className="text-gray-600 mb-4">
              Este produto não está disponível nas farmácias cadastradas ou não existe no sistema.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Possíveis motivos:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• O produto acabou nas farmácias</li>
                <li>• O produto ainda não foi cadastrado no sistema</li>
                <li>• Tente pesquisar pelo nome genérico do produto</li>
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
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {result.name}
                  </h3>
                  {result.category && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Categoria:</span> {result.category}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Preço:</span>
                      <span className="text-lg font-bold text-green-600">
                        {result.lowestPrice.toLocaleString('pt-MZ')} MT
                      </span>
                      {result.lowestPrice !== result.highestPrice && (
                        <span className="text-sm text-gray-500">
                          - {result.highestPrice.toLocaleString('pt-MZ')} MT
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Disponível em:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {result.pharmacyCount} {result.pharmacyCount === 1 ? 'farmácia' : 'farmácias'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Comparação de Preços:</p>
                  <div className="space-y-3">
                    {result.pharmacies.map((pharmacy, index) => (
                      <div
                        key={pharmacy.pharmacyId}
                        className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 rounded-lg ${
                          index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                                Menor Preço
                              </span>
                            )}
                            <p className="font-medium text-gray-900">{pharmacy.pharmacyName}</p>
                          </div>
                          <p className="text-sm text-gray-600">
                            {pharmacy.neighborhood}, {pharmacy.city}
                          </p>
                          <p className="text-sm text-gray-500">{pharmacy.address}</p>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2">
                          {pharmacy.available ? (
                            <>
                              <p className={`text-xl font-bold ${index === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                {pharmacy.price.toLocaleString('pt-MZ')} MT
                              </p>
                              <p className="text-sm text-gray-600">
                                Quantidade: {pharmacy.quantity}
                              </p>
                              <div className="flex gap-2">
                                <Link
                                  href={`/pharmacy/${pharmacy.pharmacyId}`}
                                  className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                  Ver Farmácia
                                </Link>
                                <button
                                  onClick={() => handleAddToCart(result, pharmacy)}
                                  className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  Adicionar
                                </button>
                              </div>
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