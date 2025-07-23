import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Volver al inicio
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/habitaciones" className="hover:text-green-600">
              Ver habitaciones
            </Link>
            {' • '}
            <Link href="/reservar" className="hover:text-green-600">
              Hacer reserva
            </Link>
            {' • '}
            <Link href="/contacto" className="hover:text-green-600">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 