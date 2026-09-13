'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PharmacyDashboardNav from '@/components/PharmacyDashboardNav';

export default function PharmacySettingsPage() {
  const { data: session } = useSession();
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    city: '',
    phone: '',
    openingHours: '',
    latitude: '',
    longitude: '',
    googleMapsLink: '',
  });
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [parsingLink, setParsingLink] = useState(false);

  useEffect(() => {
    fetchPharmacyData();
  }, []);

  const fetchPharmacyData = async () => {
    try {
      const response = await fetch('/api/pharmacies/my-pharmacy');
      if (response.ok) {
        const data = await response.json();
        setPharmacy(data);
        setFormData({
          name: data.name,
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          phone: data.phone,
          openingHours: data.openingHours,
          latitude: data.location?.coordinates[1] || '',
          longitude: data.location?.coordinates[0] || '',
          googleMapsLink: '',
        });
      }
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const location = formData.latitude && formData.longitude
        ? {
            type: 'Point' as const,
            coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
          }
        : undefined;

      const dataToSend: any = {
        name: formData.name,
        address: formData.address,
        neighborhood: formData.neighborhood,
        city: formData.city,
        phone: formData.phone,
        openingHours: formData.openingHours,
      };

      if (location) {
        dataToSend.location = location;
      }

      const response = await fetch('/api/pharmacies/my-pharmacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setMessage('Informações atualizadas com sucesso!');
        fetchPharmacyData();
      } else {
        setMessage('Erro ao atualizar informações. Tente novamente.');
      }
    } catch (error) {
      setMessage('Erro ao atualizar informações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setMessage('Seu navegador não suporta geolocalização.');
      return;
    }

    setDetectingLocation(true);
    setMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          googleMapsLink: formData.googleMapsLink,
        });
        setDetectingLocation(false);
        setMessage('Localização detectada com sucesso!');
      },
      (error) => {
        setDetectingLocation(false);
        setMessage('Erro ao detectar localização. Verifique as permissões do navegador.');
      }
    );
  };

  const parseGoogleMapsLink = async (link: string) => {
    setParsingLink(true);
    setMessage('');

    try {
      let actualLink = link;
      let lat: number | null = null;
      let lng: number | null = null;

      // Check if it's a shortened link
      if (link.includes('goo.gl') || link.includes('maps.app')) {
        try {
          // Try to resolve the shortened link
          const response = await fetch(link, {
            method: 'HEAD',
            redirect: 'follow',
          });
          actualLink = response.url;
        } catch (error) {
          // If fetch fails, just use the original link
          actualLink = link;
        }
      }

      // Try different Google Maps URL formats
      // Format 1: @lat,lng,z
      const atMatch = actualLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        lat = parseFloat(atMatch[1]);
        lng = parseFloat(atMatch[2]);
      }

      // Format 2: q=lat,lng
      if (!lat) {
        const qMatch = actualLink.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (qMatch) {
          lat = parseFloat(qMatch[1]);
          lng = parseFloat(qMatch[2]);
        }
      }

      // Format 3: /lat,lng
      if (!lat) {
        const pathMatch = actualLink.match(/\/(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (pathMatch) {
          lat = parseFloat(pathMatch[1]);
          lng = parseFloat(pathMatch[2]);
        }
      }

      if (lat && lng) {
        setFormData({
          ...formData,
          latitude: lat.toString(),
          longitude: lng.toString(),
          googleMapsLink: formData.googleMapsLink,
        });
        setMessage('Coordenadas extraídas do link do Google Maps com sucesso!');
      } else {
        setMessage('Não foi possível extrair coordenadas do link. Tente abrir o link no Google Maps e copiar o URL completo da barra de endereços.');
      }
    } catch (error) {
      setMessage('Erro ao processar o link. Tente abrir o link no Google Maps e copiar o URL completo da barra de endereços.');
    } finally {
      setParsingLink(false);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Definições da Farmácia
          </h1>
          <p className="text-gray-600">
            Atualize as informações da sua farmácia
          </p>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            message.includes('sucesso')
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Farmácia
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Endereço
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="Maputo">Maputo</option>
                <option value="Matola">Matola</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
                Horário de Funcionamento
              </label>
              <input
                type="text"
                id="openingHours"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
                placeholder="Seg-Sex: 8h-20h, Sáb: 9h-13h"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização no Mapa</h3>
              <p className="text-sm text-gray-600 mb-4">
                Defina a localização da sua farmácia para aparecer no mapa interativo. Isso ajuda os clientes a encontrá-la.
              </p>

              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {detectingLocation ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      A detectar...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Detectar Minha Localização
                    </>
                  )}
                </button>
                <span className="text-sm text-gray-500">
                  Ou insira manualmente as coordenadas abaixo
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="-25.9692"
                  />
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="32.5732"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <label htmlFor="googleMapsLink" className="block text-sm font-medium text-gray-700 mb-1">
                  Link do Google Maps (opcional)
                </label>
                <input
                  type="url"
                  id="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="https://maps.google.com/?q=-25.9692,32.5732"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cole o link do Google Maps da sua localização para extrair coordenadas automaticamente
                </p>
                {formData.googleMapsLink && (
                  <button
                    type="button"
                    onClick={() => parseGoogleMapsLink(formData.googleMapsLink)}
                    disabled={parsingLink}
                    className="mt-2 inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {parsingLink ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        A processar...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Extrair Coordenadas do Link
                      </>
                    )}
                  </button>
                )}
              </div>

              {formData.latitude && formData.longitude && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Localização definida: {formData.latitude}, {formData.longitude}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Sua farmácia aparecerá no mapa após salvar.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Estado da Farmácia</h3>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              pharmacy?.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : pharmacy?.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {pharmacy?.status === 'approved' ? 'Aprovada' : pharmacy?.status === 'pending' ? 'Em Análise' : 'Suspensa'}
            </span>
          </div>
          {pharmacy?.status === 'pending' && (
            <p className="text-sm text-gray-600 mt-2">
              A sua farmácia está em análise. Será notificado quando for aprovada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}