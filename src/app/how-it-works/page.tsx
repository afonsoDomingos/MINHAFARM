export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Como Funciona a ConectLife
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra como é fácil encontrar medicamentos disponíveis nas farmácias cadastradas em Moçambique
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Passo a Passo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pesquise</h3>
              <p className="text-gray-600">
                Procure pelo nome do medicamento que você precisa
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Encontre</h3>
              <p className="text-gray-600">
                Veja as farmácias onde o medicamento está disponível
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Solicite</h3>
              <p className="text-gray-600">
                Escolha uma farmácia e envie o seu pedido
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirme</h3>
              <p className="text-gray-600">
                A farmácia confirma e orienta sobre o levantamento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Explanation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Detalhes do Processo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">1</span>
                </span>
                Pesquisa de Medicamentos
              </h3>
              <p className="text-gray-600 mb-4">
                Na página inicial, digite o nome do medicamento que você procura na barra de pesquisa. 
                O sistema buscará em todas as farmácias cadastradas para encontrar onde o medicamento está disponível.
              </p>
              <p className="text-gray-600">
                Você também pode filtrar por localização, disponibilidade e preço para encontrar a melhor opção.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">2</span>
                </span>
                Visualização de Resultados
              </h3>
              <p className="text-gray-600 mb-4">
                Os resultados mostram o nome do medicamento, a farmácia onde está disponível, o preço, 
                a localização e a disponibilidade em tempo real.
              </p>
              <p className="text-gray-600">
                Você pode clicar em qualquer farmácia para ver mais detalhes, como horário de funcionamento, 
                endereço completo e todos os medicamentos disponíveis.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">3</span>
                </span>
                Solicitação de Pedido
              </h3>
              <p className="text-gray-600 mb-4">
                Após escolher a farmácia, você pode solicitar o medicamento informando a quantidade desejada.
                O pedido é enviado para a farmácia para análise.
              </p>
              <p className="text-gray-600">
                Para medicamentos que exigem receita médica, o sistema indica essa necessidade e 
                a farmácia solicitará os documentos necessários.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">4</span>
                </span>
                Confirmação e Levantamento
              </h3>
              <p className="text-gray-600 mb-4">
                A farmácia recebe o pedido e verifica a disponibilidade real. 
                Em seguida, confirma ou rejeita o pedido com base no stock atual.
              </p>
              <p className="text-gray-600">
                Se confirmado, você será notificado e poderá levantar o medicamento na farmácia 
                no horário estabelecido. Algumas farmácias podem oferecer serviço de entrega.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Pharmacies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Para Farmácias
          </h2>
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Cadastro Fácil
                </h3>
                <p className="text-gray-600">
                  Cadastre sua farmácia em poucos minutos. Após aprovação, 
                  você pode começar a gerir seus medicamentos e pedidos.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Gestão Simples
                </h3>
                <p className="text-gray-600">
                  Adicione medicamentos, atualize preços, controle o stock e 
                  processe pedidos através de um painel intuitivo.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aumento de Vendas
                </h3>
                <p className="text-gray-600">
                  Chegue a mais clientes que procuram seus medicamentos. 
                  Aumente a visibilidade da sua farmácia na região.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Segurança e Conformidade
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Farmácias Verificadas</h3>
              <p className="text-gray-600">
                Todas as farmácias são cadastradas e verificadas antes de serem aprovadas na plataforma.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dados Protegidos</h3>
              <p className="text-gray-600">
                Seus dados pessoais e informações estão seguros e protegidos de acordo com a legislação.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Conformidade Legal</h3>
              <p className="text-gray-600">
                Cumprimos a legislação farmacêutica de Moçambique para garantir medicamentos seguros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Junte-se à ConectLife e descubra como é fácil encontrar medicamentos disponíveis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/search"
              className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Buscar Medicamentos
            </a>
            <a
              href="/pharmacy-register"
              className="inline-block bg-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Cadastrar Farmácia
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}