'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  SparklesIcon, 
  BeakerIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  SunIcon,
  WifiIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Imágenes del carousel
  const carouselImages = [
    '/carrousel/hotelcarrousel.webp',
    '/carrousel/hotelcarrousel2.webp',
    '/carrousel/carrousel.webp',
    '/carrousel/carrousel2.webp'
  ];

  // Cambio automático de imágenes cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Animación de carga
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section con Carousel de Fondo */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel de Fondo */}
        <div className="absolute inset-0 z-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
          ))}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </div>

        {/* Contenido Hero */}
        <div className={`relative z-10 text-center px-4 max-w-5xl mx-auto text-white transition-all duration-1000 transform ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            Hotel
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Paraíso Verde
            </span>
          </h1>
          <p className="text-xl md:text-3xl mb-4 font-light tracking-wide">
            Tu escape perfecto en la naturaleza.
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-200 max-w-3xl mx-auto">
            Descubre la belleza natural y el confort moderno en nuestro hotel boutique, 
            donde cada detalle está diseñado para tu bienestar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/login" 
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10">Iniciar Sesión</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/contacto" 
              className="group border-2 border-white/80 hover:border-white text-white hover:bg-white hover:text-green-600 font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              Contactar
            </Link>
          </div>
        </div>

        {/* Indicadores del Carousel */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Bienvenido al 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600"> Paraíso</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Un refugio donde la elegancia se encuentra con la naturaleza, 
              creando experiencias extraordinarias que perduran en el tiempo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: HomeIcon,
                title: "Habitaciones Elegantes",
                desc: "Espacios cuidadosamente diseñados con vistas espectaculares, comodidades premium y detalles que marcan la diferencia.",
                color: "from-blue-400 to-blue-600",
                image: "/habelegante.webp"
              },
              {
                icon: BeakerIcon,
                title: "Gastronomía de Autor",
                desc: "Experiencias culinarias excepcionales con ingredientes frescos, técnicas innovadoras y sabores que despiertan los sentidos.",
                color: "from-orange-400 to-red-500",
                image: "/gastronomiadeautor.jpeg"
              },
              {
                icon: SparklesIcon,
                title: "Naturaleza Pura",
                desc: "Inmerso en jardines exuberantes, senderos serpenteantes y la belleza intacta de un ecosistema único.",
                color: "from-green-400 to-emerald-600",
                image: "/naturalezapura.jpeg"
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="group">
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-80">
                    {/* Imagen de fondo */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${item.image})`,
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Contenido */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                      <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg p-3`}>
                        <IconComponent className="w-8 h-8 text-white drop-shadow-sm" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all duration-500 animate-fade-in-up">
                        {item.title.split('').map((char, i) => (
                          <span 
                            key={i} 
                            className="inline-block hover:animate-bounce hover:text-yellow-300 transition-colors duration-300"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </span>
                        ))}
                      </h3>
                      
                      <p className="text-gray-200 leading-relaxed text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                        {item.desc.split(' ').map((word, i) => (
                          <span 
                            key={i} 
                            className="inline-block mr-1 group-hover:animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.05}s` }}
                          >
                            {word}
                          </span>
                        ))}
                      </p>
                    </div>
                    
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesitas para una experiencia inolvidable está a tu alcance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: HomeIcon, 
                title: "Piscina Infinity", 
                desc: "Piscina climatizada con vista al jardín y efecto infinito", 
                color: "bg-blue-50 hover:bg-blue-100" 
              },
              { 
                icon: HeartIcon, 
                title: "Spa Wellness", 
                desc: "Tratamientos relajantes, masajes terapéuticos y aromaterapia", 
                color: "bg-purple-50 hover:bg-purple-100" 
              },
              { 
                icon: WrenchScrewdriverIcon, 
                title: "Gimnasio Premium", 
                desc: "Equipamiento de última generación las 24 horas", 
                color: "bg-red-50 hover:bg-red-100" 
              },
              { 
                icon: TruckIcon, 
                title: "Valet Parking", 
                desc: "Estacionamiento con servicio de valet incluido", 
                color: "bg-gray-50 hover:bg-gray-100" 
              },
              { 
                icon: BeakerIcon, 
                title: "Restaurante Gourmet", 
                desc: "Cocina de autor con productos orgánicos locales", 
                color: "bg-orange-50 hover:bg-orange-100" 
              },
              { 
                icon: SunIcon, 
                title: "Terraza Panorámica", 
                desc: "Vistas de 360° con servicio de cocktails", 
                color: "bg-yellow-50 hover:bg-yellow-100" 
              },
              { 
                icon: SparklesIcon, 
                title: "Housekeeping Premium", 
                desc: "Servicio de limpieza personalizado y discreta", 
                color: "bg-green-50 hover:bg-green-100" 
              },
              { 
                icon: WifiIcon, 
                title: "WiFi Fiber", 
                desc: "Internet de fibra óptica de alta velocidad", 
                color: "bg-indigo-50 hover:bg-indigo-100" 
              }
            ].map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <div key={index} className="group">
                  <div className={`${service.color} rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-white/50`}>
                    <div className="text-gray-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ServiceIcon className="w-10 h-10" />
                    </div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            ¿Listo para tu escape perfecto?
          </h2>
          <p className="text-xl md:text-2xl mb-12 text-green-100 max-w-3xl mx-auto leading-relaxed">
            Reserva ahora y sumérgete en una experiencia que transformará tu manera de ver la hospitalidad
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/reservar" 
              className="group bg-white text-green-600 hover:bg-gray-100 font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
            >
              <span className="group-hover:scale-110 inline-block transition-transform duration-300">
                Hacer Reserva 🌟
              </span>
            </Link>
            <Link 
              href="/contacto" 
              className="group border-2 border-white/80 hover:border-white text-white hover:bg-white hover:text-green-600 font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="group-hover:scale-110 inline-block transition-transform duration-300">
                Contactar 📞
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
