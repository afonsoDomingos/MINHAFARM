'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PharmacyDashboardNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard/pharmacy', label: 'Visão Geral', icon: '📊' },
    { href: '/dashboard/pharmacy/medicines', label: 'Produtos', icon: '�' },
    { href: '/dashboard/pharmacy/orders', label: 'Pedidos', icon: '📋' },
    { href: '/dashboard/pharmacy/reports', label: 'Relatórios', icon: '📈' },
    { href: '/dashboard/pharmacy/settings', label: 'Definições', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                pathname === item.href
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}