'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mozambiqueProvinces, neighborhoodsByProvince, openingHoursOptions } from '@/data/locations';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<'user' | 'pharmacy' | ''>('');
  const [formData, setFormData] = useState({
    // User fields
    name: '',
    // Pharmacy fields
    pharmacyName: '',
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    openingHours: '',
  });
  const [customOpeningHours, setCustomOpeningHours] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpeningHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, openingHours: value });
    if (value === '') {
      setCustomOpeningHours('');
    }
  };

  const validateStep = () => {
    setError('');

    if (step === 1 && !accountType) {
      setError('Selecione o tipo de conta');
      return false;
    }

    if (step === 2) {
      if (!formData.email) {
        setError('Email é obrigatório');
        return false;
      }
      if (!formData.password) {
        setError('Password é obrigatória');
        return false;
      }
      if (formData.password.length < 6) {
        setError('A password deve ter pelo menos 6 caracteres');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As passwords não coincidem');
        return false;
      }
      if (!formData.phone) {
        setError('Telefone é obrigatório');
        return false;
      }
    }

    if (step === 3) {
      if (accountType === 'user' && !formData.name) {
        setError('Nome é obrigatório');
        return false;
      }
      if (accountType === 'pharmacy') {
        if (!formData.pharmacyName) {
          setError('Nome da farmácia é obrigatório');
          return false;
        }
        if (!formData.address) {
          setError('Endereço é obrigatório');
          return false;
        }
        if (!formData.neighborhood) {
          setError('Bairro é obrigatório');
          return false;
        }
        if (!formData.openingHours) {
          setError('Horário de funcionamento é obrigatório');
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep()) {
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
            city: mozambiqueProvinces.find(p => p.id === formData.city)?.name || formData.city,
            phone: formData.phone,
            openingHours: formData.openingHours || customOpeningHours,
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

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Step 1: Account Type */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Passo 1 de 3: Tipo de Conta
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Selecione o tipo de conta que deseja criar
              </p>
              <div className="space-y-3">
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                  <input
                    type="radio"
                    name="accountType"
                    value="user"
                    checked={accountType === 'user'}
                    onChange={(e) => setAccountType(e.target.value as 'user' | 'pharmacy')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">
                      Cliente
                    </span>
                    <span className="block text-sm text-gray-500">
                      Encontrar medicamentos e fazer pedidos
                    </span>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-colors">
                  <input
                    type="radio"
                    name="accountType"
                    value="pharmacy"
                    checked={accountType === 'pharmacy'}
                    onChange={(e) => setAccountType(e.target.value as 'user' | 'pharmacy')}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-medium text-gray-900">
                      Farmácia
                    </span>
                    <span className="block text-sm text-gray-500">
                      Cadastrar medicamentos e gerir pedidos
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Common Fields */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Passo 2 de 3: Informações de Acesso
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha suas informações de acesso
              </p>
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
                    placeholder="•••••••••"
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
                    placeholder="•••••••••"
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
            </div>
          )}

          {/* Step 3: Specific Fields */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Passo 3 de 3: {accountType === 'user' ? 'Informações Pessoais' : 'Informações da Farmácia'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {accountType === 'user' 
                  ? 'Preencha suas informações pessoais'
                  : 'Preencha as informações da sua farmácia'
                }
              </p>
              <div className="space-y-3">
                {accountType === 'user' ? (
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
                ) : (
                  <>
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
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        Cidade/Província *
                      </label>
                      <select
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={(e) => {
                          handleChange(e);
                          setFormData({ ...formData, city: e.target.value, neighborhood: '' });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Selecione a cidade</option>
                        {mozambiqueProvinces.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                        Bairro *
                      </label>
                      <select
                        id="neighborhood"
                        name="neighborhood"
                        required
                        value={formData.neighborhood}
                        onChange={handleChange}
                        disabled={!formData.city}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Selecione primeiro a cidade</option>
                        {formData.city && neighborhoodsByProvince[formData.city]?.map((neighborhood) => (
                          <option key={neighborhood} value={neighborhood}>
                            {neighborhood}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
                        Horário de Funcionamento *
                      </label>
                      <select
                        id="openingHours"
                        name="openingHours"
                        required
                        value={formData.openingHours}
                        onChange={handleOpeningHoursChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Selecione o horário</option>
                        {openingHoursOptions.map((option) => (
                          <option key={option.id} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {formData.openingHours === '' && (
                        <input
                          type="text"
                          value={customOpeningHours}
                          onChange={(e) => setCustomOpeningHours(e.target.value)}
                          onBlur={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                          className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Digite o horário personalizado (ex: Seg-Sex: 8h-20h)"
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'A criar conta...' : 'Criar Conta'}
              </button>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem conta?{' '}
              <Link href={accountType === 'pharmacy' ? '/pharmacy-login' : '/login'} className="font-medium text-green-600 hover:text-green-500">
                Entrar
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
