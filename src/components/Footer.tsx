import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/logominhafarm.png" alt="ConectLife Logo" className="h-14 w-auto" />
            </div>
            <p className="text-gray-600 text-sm">
              Encontrar o que precisa, quando precisa, onde precisa.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-gray-600 hover:text-green-600 text-sm">
                  Encontrar Medicamento
                </Link>
              </li>
              <li>
                <Link href="/pharmacies" className="text-gray-600 hover:text-green-600 text-sm">
                  Farmácias
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-green-600 text-sm">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Para Farmácias</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-gray-600 hover:text-green-600 text-sm">
                  Cadastrar Farmácia
                </Link>
              </li>
              <li>
                <Link href="/pharmacy-login" className="text-gray-600 hover:text-green-600 text-sm">
                  Área da Farmácia
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-green-600 text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-green-600 text-sm">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm mb-4">
            © {new Date().getFullYear()} ConectLife. Todos os direitos reservados.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-gray-500 text-sm">Powered by</span>
            <a 
              href="https://www.wehosthere.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <img src="/wehosthere logo.png" alt="Wehosthere" className="h-6 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}