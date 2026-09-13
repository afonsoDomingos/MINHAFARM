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
  const [filterRadius, setFilterRadius] = useState<number>(25);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [routeToPharmacy, setRouteToPharmacy] = useState<Pharmacy | null>(null);
  const [routeDistance, setRouteDistance] = useState<string>('');
  const [routeTime, setRouteTime] = useState<string>('');
  const mapRef = useRef<any>(null);
  const routingControlRef = useRef<any>(null);
  const [mapZoom, setMapZoom] = useState<number>(12);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchPharmacies();
    getUserLocation();

    // Only add scroll listener on client side
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        if (window.scrollY > 300) {
          setShowScrollTop(true);
        } else {
          setShowScrollTop(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
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
      } else {
        console.error('Failed to fetch pharmacies:', response.statusText);
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

  const reverseGeocodeUserLocation = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'ConectLife-Mozambique',
          },
        }
      );

      if (!response.ok) {
        console.error('Reverse geocoding failed:', response.statusText);
        return;
      }

      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;
        let addressParts = [];

        if (addr.road) addressParts.push(addr.road);
        if (addr.suburb || addr.neighbourhood) addressParts.push(addr.suburb || addr.neighbourhood);
        if (addr.city || addr.town || addr.village) addressParts.push(addr.city || addr.town || addr.village);

        if (addressParts.length > 0) {
          setUserAddress(addressParts.join(', '));
        } else {
          setUserAddress(data.display_name);
        }
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização.');
      return;
    }

    setDetectingLocation(true);
    setUserAddress('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation([lat, lng]);
        setDetectingLocation(false);
        // Reverse geocode to get address
        reverseGeocodeUserLocation(lat, lng);
      },
      (error) => {
        console.error('Error getting location:', error);
        setDetectingLocation(false);
        alert('Erro ao detectar localização. Verifique as permissões do navegador.');
      }
    );
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

  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

              <button
                type="button"
                onClick={getUserLocation}
                disabled={detectingLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[42px] mt-5"
              >
                {detectingLocation ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A detectar...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Detectar Minha Localização
                  </>
                )}
              </button>

              {userLocation && (
                <div className="flex items-center gap-2 mt-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    📍 Localização detectada
                  </span>
                  {userAddress && (
                    <span className="text-sm text-gray-600 max-w-[300px] truncate">
                      {userAddress}
                    </span>
                  )}
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
                          {userAddress && <p className="text-sm text-gray-600 mt-1">{userAddress}</p>}
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

                    const isSelected = selectedPharmacy?._id === pharmacy._id;

                    // Custom icon for selected pharmacy - check if L is available
                    let selectedIcon = undefined;
                    if (isSelected && typeof window !== 'undefined' && (window as any).L && (window as any).L.divIcon) {
                      selectedIcon = new (window as any).L.divIcon({
                        className: 'custom-selected-marker',
                        html: `<div style="background-color: #dc2626; border: 3px solid white; border-radius: 50%; width: 30px; height: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15],
                      });
                    }

                    return (
                      <Marker
                        key={pharmacy._id}
                        position={[pharmacy.location.coordinates[1], pharmacy.location.coordinates[0]]}
                        icon={selectedIcon}
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
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Ligar
                              </a>
                              <button
                                onClick={() => handleShowRoute(pharmacy)}
                                className="inline-flex items-center justify-center px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                Ver Rota
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
                        className={`border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                          selectedPharmacy?._id === pharmacy._id ? 'border-red-500 bg-red-50' : 'border-gray-200'
                        }`}
                        onClick={() => handleSelectPharmacy(pharmacy)}
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
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Ligar
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowRoute(pharmacy);
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Rota
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
                  {userLocation && selectedPharmacy.location && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800">Distância até você</p>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateDistance(
                          userLocation[0],
                          userLocation[1],
                          selectedPharmacy.location.coordinates[1],
                          selectedPharmacy.location.coordinates[0]
                        ).toFixed(1)} km
                      </p>
                    </div>
                  )}
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
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Ligar
                    </a>
                    {userLocation && selectedPharmacy.location && (
                      <button
                        onClick={() => handleShowRoute(selectedPharmacy)}
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Ver Rota no Google Maps
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 z-50"
          title="Voltar ao topo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
