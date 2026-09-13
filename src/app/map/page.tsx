'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Pharmacy {
  _id: string;
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  openingHours: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  rating?: number;
  isOpen?: boolean;
}

export default function MapPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [filterRadius, setFilterRadius] = useState<number>(5);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [routeToPharmacy, setRouteToPharmacy] = useState<Pharmacy | null>(null);
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [routeTime, setRouteTime] = useState<string>('');
  const mapRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const [mapZoom, setMapZoom] = useState<number>(userLocation ? 13 : 12);

  useEffect(() => {
    fetchPharmacies();
    getUserLocation();
  }, []);

  useEffect(() => {
    // Adjust zoom based on filter radius
    if (filterRadius <= 1) setMapZoom(16);
    else if (filterRadius <= 2) setMapZoom(15);
    else if (filterRadius <= 3) setMapZoom(15);
    else if (filterRadius <= 4) setMapZoom(14);
    else if (filterRadius <= 5) setMapZoom(14);
    else if (filterRadius <= 10) setMapZoom(13);
    else if (filterRadius <= 25) setMapZoom(12);
    else if (filterRadius <= 50) setMapZoom(11);
    else if (filterRadius <= 100) setMapZoom(10);
    else if (filterRadius <= 200) setMapZoom(9);
    else if (filterRadius <= 500) setMapZoom(8);
    else setMapZoom(7);
  }, [filterRadius]);

  const fetchPharmacies = async () => {
    try {
      const response = await fetch('/api/pharmacies');
      if (response.ok) {
        const data = await response.json();
        const pharmaciesWithOpenStatus = data.map((pharmacy: Pharmacy) => ({
          ...pharmacy,
          isOpen: checkIfOpen(pharmacy.openingHours),
        }));
        setPharmacies(pharmaciesWithOpenStatus);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfOpen = (openingHours: string): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    const isWeekday = currentDay >= 1 && currentDay <= 5;
    const isSaturday = currentDay === 6;

    if (isWeekday && currentHour >= 8 && currentHour < 20) {
      return true;
    } else if (isSaturday && currentHour >= 9 && currentHour < 13) {
      return true;
    } else {
      return false;
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const getFilteredPharmacies = () => {
    if (!userLocation) return pharmacies;
    return pharmacies.filter((pharmacy) => {
      if (!pharmacy.location) return false;
      const distance = calculateDistance(
        userLocation[0],
        userLocation[1],
        pharmacy.location.coordinates[1],
        pharmacy.location.coordinates[0]
      );
      return distance <= filterRadius;
    });
  };

  const handleShowRoute = (pharmacy: Pharmacy) => {
    if (!userLocation || !pharmacy.location) return;

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${pharmacy.location.coordinates[1]},${pharmacy.location.coordinates[0]}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
  };

  const filteredPharmacies = getFilteredPharmacies();

  const centerLocation = userLocation || [-25.9692, 32.5732];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">A carregar mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mapa de Farmácias</h1>
              <p className="text-gray-600">Encontre farmácias próximas a você</p>
            </div>
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raio de Busca (km)
                </label>
                <select
                  value={filterRadius}
                  onChange={(e) => setFilterRadius(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value={1}>1 km</option>
                  <option value={2}>2 km</option>
                  <option value={3}>3 km</option>
                  <option value={4}>4 km</option>
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                  <option value={100}>100 km</option>
                  <option value={200}>200 km</option>
                  <option value={500}>500 km</option>
                  <option value={1000}>1000 km</option>
                </select>
              </div>

              {userLocation && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    📍 Localização detectada
                  </span>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredPharmacies.length}</span> farmácias encontradas
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[600px]">
                <MapContainer
                  center={centerLocation as [number, number]}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>
                        <div className="text-center">
                          <p className="font-semibold">Sua Localização</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {filteredPharmacies.map((pharmacy) => {
                    if (!pharmacy.location) return null;
                    const distance = userLocation
                      ? calculateDistance(
                          userLocation[0],
                          userLocation[1],
                          pharmacy.location.coordinates[1],
                          pharmacy.location.coordinates[0]
                        ).toFixed(1)
                      : null;

                    return (
                      <Marker
                        key={pharmacy._id}
                        position={[pharmacy.location.coordinates[1], pharmacy.location.coordinates[0]]}
                      >
                        <Popup>
                          <div className="min-w-[200px]">
                            <h3 className="font-semibold text-gray-900 mb-2">{pharmacy.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">{pharmacy.address}</p>
                            <p className="text-sm text-gray-600 mb-1">{pharmacy.neighborhood}, {pharmacy.city}</p>
                            {distance && (
                              <p className="text-sm font-medium text-green-600 mb-2">
                                {distance} km de distância
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {pharmacy.isOpen && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  🟢 Aberto
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 mt-3">
                              <a
                                href={`tel:${pharmacy.phone}`}
                                className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                📞 Ligar
                              </a>
                              <button
                                onClick={() => handleShowRoute(pharmacy)}
                                className="inline-flex items-center justify-center px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                🗺️ Ver Rota
                              </button>
                              <Link
                                href={`/pharmacy/${pharmacy._id}`}
                                className="inline-block text-sm text-green-600 hover:text-green-700 font-medium text-center"
                              >
                                Ver detalhes →
                              </Link>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Farmácias Próximas</h2>
              {filteredPharmacies.length === 0 ? (
                <p className="text-gray-600 text-sm">
                  Nenhuma farmácia encontrada neste raio.
                </p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredPharmacies.map((pharmacy) => {
                    const distance = userLocation && pharmacy.location
                      ? calculateDistance(
                          userLocation[0],
                          userLocation[1],
                          pharmacy.location.coordinates[1],
                          pharmacy.location.coordinates[0]
                        ).toFixed(1)
                      : null;

                    return (
                      <div
                        key={pharmacy._id}
                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPharmacy(pharmacy)}
                      >
                        <h3 className="font-medium text-gray-900 mb-1">{pharmacy.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{pharmacy.neighborhood}, {pharmacy.city}</p>
                        {distance && (
                          <p className="text-sm font-medium text-green-600">
                            {distance} km
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {pharmacy.isOpen && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              🟢 Aberto
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <a
                            href={`tel:${pharmacy.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            📞 Ligar
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowRoute(pharmacy);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            🗺️ Rota
                          </button>
                          <Link
                            href={`/pharmacy/${pharmacy._id}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Detalhes
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedPharmacy && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nome</p>
                    <p className="text-sm text-gray-900">{selectedPharmacy.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Endereço</p>
                    <p className="text-sm text-gray-900">{selectedPharmacy.address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Bairro</p>
                    <p className="text-sm text-gray-900">{selectedPharmacy.neighborhood}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Cidade</p>
                    <p className="text-sm text-gray-900">{selectedPharmacy.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telefone</p>
                    <p className="text-sm text-gray-900">{selectedPharmacy.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Horário</p>
                    <p className="text-sm text-gray-900">{selectedPharmacy.openingHours}</p>
                  </div>
                  {selectedPharmacy.rating && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Avaliação</p>
                      <p className="text-sm text-gray-900">⭐ {selectedPharmacy.rating}/5</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedPharmacy.isOpen && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        🟢 Aberto Agora
                      </span>
                    )}
                  </div>
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <a
                      href={`tel:${selectedPharmacy.phone}`}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📞 Ligar
                    </a>
                    {userLocation && selectedPharmacy.location && (
                      <button
                        onClick={() => handleShowRoute(selectedPharmacy)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        🗺️ Ver Rota no Google Maps
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
