export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-600">
            Disfruta de una experiencia completa en el Hotel Paraíso Verde
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Restaurante */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Restaurante</h3>
            </div>
            <p className="text-gray-600 text-center">
              Disfruta de la mejor gastronomía local e internacional en nuestro restaurante con vista al mar.
            </p>
          </div>

          {/* Spa */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧖‍♀️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Spa & Wellness</h3>
            </div>
            <p className="text-gray-600 text-center">
              Relájate con nuestros tratamientos de spa y masajes terapéuticos.
            </p>
          </div>

          {/* Piscina */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏊‍♂️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Piscina</h3>
            </div>
            <p className="text-gray-600 text-center">
              Refréscate en nuestra piscina con vista panorámica al océano.
            </p>
          </div>

          {/* Gimnasio */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Gimnasio</h3>
            </div>
            <p className="text-gray-600 text-center">
              Mantén tu rutina de ejercicios en nuestro gimnasio completamente equipado.
            </p>
          </div>

          {/* Wi-Fi */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📶</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Wi-Fi Gratuito</h3>
            </div>
            <p className="text-gray-600 text-center">
              Conectividad de alta velocidad en todas las áreas del hotel.
            </p>
          </div>

          {/* Room Service */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛎️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Room Service</h3>
            </div>
            <p className="text-gray-600 text-center">
              Servicio a la habitación disponible las 24 horas del día.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 