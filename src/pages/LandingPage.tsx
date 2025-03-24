import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header/Nav */}
      <nav className="bg-black/30 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">Rest<span className="text-emerald-400">Visor</span></span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Acceder
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Gestión de Restaurantes<br />
            <span className="text-emerald-400">Simplificada</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl">
            Sistema integral de gestión de pedidos y mesas para restaurantes. 
            Optimiza tus operaciones con tecnología moderna y fácil de usar.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Comenzar Ahora
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-all duration-300">
            <div className="h-12 w-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Toma de Comandas Digital</h3>
            <p className="text-gray-400">
              Captura pedidos de forma rápida y precisa desde dispositivos móviles, eliminando errores y mejorando la eficiencia.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-all duration-300">
            <div className="h-12 w-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Sincronización en Tiempo Real</h3>
            <p className="text-gray-400">
              Comunicación instantánea entre sala y cocina, actualizaciones en vivo del estado de los pedidos y mesas.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-emerald-500/50 transition-all duration-300">
            <div className="h-12 w-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Control de Mesas</h3>
            <p className="text-gray-400">
              Gestión visual e intuitiva del estado de las mesas, reservas y ocupación en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white mb-8">Rest<span className="text-emerald-400">Visor</span></span>
            <p className="text-gray-400 text-center max-w-md mb-8">
              Transformando la gestión de restaurantes con tecnología moderna y eficiente.
            </p>
            <div className="flex space-x-6">
              <span className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">Contacto</span>
              <span className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">Soporte</span>
              <span className="text-gray-400 hover:text-emerald-400 cursor-pointer transition-colors">Privacidad</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
