import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Hotel Paraíso Verde"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">Hotel Paraíso Verde</span>
            </div>
            <p className="text-gray-300 mb-4">
              Tu escape perfecto en la naturaleza. Un hotel boutique en Machala, Ecuador, 
              donde la comodidad se encuentra con la belleza natural.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-300">
                <MapPinIcon className="w-4 h-4 mr-2" />
                <span>Machala, El Oro, Ecuador</span>
              </div>
              <div className="flex items-center text-gray-300">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>+593 7 123 4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                <span>info@hotelparaisoverde.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/habitaciones" className="text-gray-300 hover:text-white transition-colors">
                  Habitaciones
                </Link>
              </li>
              <li>
                <Link href="/reservas" className="text-gray-300 hover:text-white transition-colors">
                  Reservas
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-300 hover:text-white transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Habitaciones de Lujo</li>
              <li className="text-gray-300">Restaurante Gourmet</li>
              <li className="text-gray-300">Spa y Wellness</li>
              <li className="text-gray-300">Piscina</li>
              <li className="text-gray-300">Gimnasio</li>
              <li className="text-gray-300">WiFi Gratuito</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Hotel Paraíso Verde. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-gray-400 hover:text-white text-sm">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-white text-sm">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 