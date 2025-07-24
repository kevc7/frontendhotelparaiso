import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Hotel Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="relative w-12 h-12 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Hotel Paraíso Verde"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                Paraíso Verde
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Tu escape perfecto en la naturaleza. Un hotel boutique en Machala, Ecuador, 
              donde la comodidad se encuentra con la belleza natural y la elegancia se fusiona con la tranquilidad.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 group hover:text-green-400 transition-colors duration-300">
                <MapPinIcon className="w-5 h-5 mr-3 text-green-400" />
                <span className="text-lg">Machala, El Oro, Ecuador</span>
              </div>
              <div className="flex items-center text-gray-300 group hover:text-green-400 transition-colors duration-300">
                <PhoneIcon className="w-5 h-5 mr-3 text-green-400" />
                <span className="text-lg">+593 7 123 4567</span>
              </div>
              <div className="flex items-center text-gray-300 group hover:text-green-400 transition-colors duration-300">
                <EnvelopeIcon className="w-5 h-5 mr-3 text-green-400" />
                <span className="text-lg">info@hotelparaisoverde.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white border-b border-green-500 pb-2">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/habitaciones', label: 'Habitaciones' },
                { href: '/reservar', label: 'Reservar' },
                { href: '/servicios', label: 'Servicios' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition-all duration-300 group flex items-center"
                  >
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white border-b border-green-500 pb-2">
              Servicios Premium
            </h3>
            <ul className="space-y-3">
              {[
                'Habitaciones de Lujo',
                'Restaurante Gourmet',
                'Spa y Wellness',
                'Piscina Infinito',
                'Gimnasio 24/7',
                'WiFi de Alta Velocidad',
                'Concierge 24/7',
                'Valet Parking'
              ].map((service) => (
                <li key={service} className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-green-400 rounded-full mr-3"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-2xl border border-green-500/20 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              ¡Mantente Conectado!
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Suscríbete para recibir ofertas exclusivas y noticias del hotel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
              />
              <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm flex items-center">
            © 2025 Hotel Paraíso Verde. Todos los derechos reservados.
            <HeartIcon className="w-4 h-4 mx-1 text-red-400 animate-pulse" />
          </p>
          <div className="flex space-x-6 mt-4 lg:mt-0">
            <Link href="/privacidad" className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-300">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-300">
              Términos y Condiciones
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-300">
              Política de Cookies
            </Link>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex justify-center space-x-6">
            {[
              { name: 'Facebook', icon: '📘' },
              { name: 'Instagram', icon: '📷' },
              { name: 'Twitter', icon: '🐦' },
              { name: 'YouTube', icon: '📺' }
            ].map((social) => (
              <button
                key={social.name}
                className="w-12 h-12 bg-gray-800/50 hover:bg-green-600 rounded-full flex items-center justify-center text-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/25 border border-gray-700 hover:border-green-500"
                title={social.name}
              >
                {social.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 