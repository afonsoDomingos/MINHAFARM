'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'user' | 'pharmacy'>('user');
  const [formData, setFormData] = useState({
    // User fields
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Pharmacy fields
    pharmacyName: '',
    address: '',
    neighborhood: '',
    city: 'Maputo',
    openingHours: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      if (accountType === 'user') {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Erro ao criar conta');
          return;
        }

        router.push('/login?registered=true');
      } else {
        const response = await fetch('/api/pharmacies/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pharmacyName: formData.pharmacyName,
            email: formData.email,
            password: formData.password,
            address: formData.address,
            neighborhood: formData.neighborhood,
            city: formData.city,
            phone: formData.phone,
            openingHours: formData.openingHours,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Erro ao registar farmácia');
          return;
        }

        router.push('/pharmacy-login?registered=true');
      }
    } catch (error) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-4">
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Criar Conta
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">
            Junte-se à ConectLife
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Account Type Selection */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Conta *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="user"
                  checked={accountType === 'user'}
                  onChange={(e) => setAccountType(e.target.value as 'user' | 'pharmacy')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Cliente</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="pharmacy"
                  checked={accountType === 'pharmacy'}
                  onChange={(e) => setAccountType(e.target.value as 'user' | 'pharmacy')}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Farmácia</span>
              </label>
            </div>
          </div>

          {/* Common Fields */}
          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Password *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="+258 84 123 4567"
              />
            </div>
          </div>

          {/* User-specific Fields */}
          {accountType === 'user' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Seu nome"
              />
            </div>
          )}

          {/* Pharmacy-specific Fields */}
          {accountType === 'pharmacy' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Farmácia *
                </label>
                <input
                  id="pharmacyName"
                  name="pharmacyName"
                  type="text"
                  required
                  value={formData.pharmacyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Farmácia Central"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Av. Julius Nyerere, 123"
                />
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro *
                </label>
                <input
                  id="neighborhood"
                  name="neighborhood"
                  type="text"
                  required
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Sommerschield"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade *
                </label>
                <select
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Maputo">Maputo</option>
                  <option value="Matola">Matola</option>
                  <option value="Beira">Beira</option>
                  <option value="Nampula">Nampula</option>
                  <option value="Quelimane">Quelimane</option>
                  <option value="Tete">Tete</option>
                  <option value="Chimoio">Chimoio</option>
                  <option value="Pemba">Pemba</option>
                  <option value="Xai-Xai">Xai-Xai</option>
                </select>
              </div>

              <div>
                <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Funcionamento *
                </label>
                <input
                  id="openingHours"
                  name="openingHours"
                  type="text"
                  required
                  value={formData.openingHours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Seg-Sex: 8h-20h, Sáb: 9h-18h"
                />
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'A criar conta...' : 'Criar Conta'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem conta?{' '}
              <Link href={accountType === 'user' ? '/login' : '/pharmacy-login'} className="font-medium text-green-600 hover:text-green-500">
                Entrar
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
