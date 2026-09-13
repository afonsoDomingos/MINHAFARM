'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PharmacyDashboardNav from '@/components/PharmacyDashboardNav';

interface SalesTrend {
  date: string;
  revenue: number;
}

interface ReportData {
  totalRevenue: number;
  orderCount: number;
  topProducts: { name: string; quantity: number }[];
  salesTrend: SalesTrend[];
  prevMonthRevenue: number;
  revenueGrowth: number;
}

export default function PharmacyReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/pharmacy-login');
    } else if (status === 'authenticated' && (session?.user as any).role !== 'pharmacy') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchReports();
    }
  }, [status, session, router]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/pharmacies/my-pharmacy/reports');
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
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
            Relatórios de Vendas
          </h1>
          <p className="text-gray-600">
            Análise de desempenho e tendências de vendas
          </p>
        </div>

        {reportData && (
          <>
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Receita este Mês</h3>
                <p className="text-3xl font-bold text-green-600">
                  {reportData.totalRevenue.toLocaleString('pt-MZ')} MT
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {reportData.revenueGrowth >= 0 ? '+' : ''}
                  {reportData.revenueGrowth.toFixed(1)}% vs mês anterior
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pedidos Concluídos</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {reportData.orderCount}
                </p>
                <p className="text-sm text-gray-600 mt-1">Este mês</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Receita Mês Anterior</h3>
                <p className="text-3xl font-bold text-gray-600">
                  {reportData.prevMonthRevenue.toLocaleString('pt-MZ')} MT
                </p>
                <p className="text-sm text-gray-600 mt-1">Para comparação</p>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Produtos Mais Vendidos
              </h2>
              {reportData.topProducts.length > 0 ? (
                <div className="space-y-3">
                  {reportData.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.quantity} vendidos
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhum produto vendido este mês
                </p>
              )}
            </div>

            {/* Sales Trend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tendência de Vendas (Este Mês)
              </h2>
              {reportData.salesTrend.length > 0 ? (
                <div className="space-y-2">
                  {reportData.salesTrend.map((trend) => (
                    <div
                      key={trend.date}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-600">{trend.date}</span>
                      <span className="font-medium text-gray-900">
                        {trend.revenue.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma venda registrada este mês
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
