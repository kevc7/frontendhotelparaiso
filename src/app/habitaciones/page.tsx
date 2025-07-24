'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, WifiIcon, TvIcon, HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface HabitacionCarrusel {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  precio: string;
  servicios: string[];
  caracteristicas: string[];
}

const habitacionesCarrusel: HabitacionCarrusel[] = [
  {
    id: 1,
    titulo: "Habitación Doble Superior",
    descripcion: "Experimenta el lujo y la comodidad en nuestra habitación doble superior, diseñada para brindarte una estadía inolvidable con vistas panorámicas y servicios premium.",
    imagen: "https://res.cloudinary.com/dqwztjdcz/image/upload/v1753337396/ChatGPT_Image_24_jul_2025_01_09_48_yysqcr.png",
    precio: "$150/noche",
    servicios: ["WiFi de alta velocidad", "TV Smart 55\"", "Baño privado con amenities", "Aire acondicionado", "Minibar", "Balcón privado", "Vista panorámica"],
    caracteristicas: ["2 personas", "35m²", "Vista al jardín", "Terraza privada"]
  },
  {
    id: 2,
    titulo: "Suite Presidencial",
    descripcion: "Nuestra suite presidencial es la máxima expresión de elegancia y exclusividad, con espacios amplios, decoración de lujo y servicios de primera clase.",
    imagen: "https://res.cloudinary.com/dqwztjdcz/image/upload/v1753337997/generated-image_2_gkgbcl.png",
    precio: "$350/noche",
    servicios: ["WiFi premium", "TV Smart 75\"", "Baño de mármol", "Aire acondicionado central", "Minibar completo", "Terraza privada", "Vista al mar", "Servicio de conserjería"],
    caracteristicas: ["4 personas", "80m²", "Vista al mar", "Terraza exclusiva"]
  }
];

export default function HabitacionesPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animateText, setAnimateText] = useState(false);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setLoading(false);
      // Animar texto después de la carga
      setTimeout(() => setAnimateText(true), 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % habitacionesCarrusel.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + habitacionesCarrusel.length) % habitacionesCarrusel.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Cambiar cada 6 segundos

    return () => clearInterval(interval);
  }, [currentSlide]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-green-400 border-t-transparent animate-ping opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">Cargando Habitaciones</h3>
          <p className="text-green-400">Preparando tu experiencia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      {/* Header con animación */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className={`text-4xl md:text-7xl font-bold text-white mb-4 text-center transition-all duration-1000 ${
            animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
          </h1>
          <p className={`text-xl md:text-2xl text-green-300 text-center transition-all duration-1000 delay-300 ${
            animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
          </p>
        </div>
      </div>

      {/* Carrusel principal */}
      <div className="relative h-screen overflow-hidden">
        {habitacionesCarrusel.map((habitacion, index) => (
          <div
            key={habitacion.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {/* Imagen de fondo con overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${habitacion.imagen})` }}
            >
              {/* Overlay gradiente mejorado */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Contenido del slide con animaciones */}
            <div className="relative h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-3xl">
                  {/* Título con animación */}
                  <h2 className={`text-5xl md:text-8xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-500 ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}>
                    {habitacion.titulo}
                  </h2>
                  
                  {/* Descripción con animación */}
                  <p className={`text-xl md:text-2xl text-white/90 mb-8 leading-relaxed transition-all duration-1000 delay-700 ${
                    index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}>
                    {habitacion.descripcion}
                  </p>
                  
                  {/* Características principales */}
                  <div className={`mb-8 transition-all duration-1000 delay-900 ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="flex flex-wrap gap-4 mb-6">
                      {habitacion.caracteristicas.map((caracteristica, idx) => (
                        <div key={idx} className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                          <StarIcon className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-white text-sm font-medium">{caracteristica}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Servicios con animación */}
                  <div className={`mb-8 transition-all duration-1000 delay-1100 ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <h3 className="text-2xl font-semibold text-white mb-4 flex items-center">
                      <WifiIcon className="w-6 h-6 text-green-400 mr-2" />
                      Servicios incluidos:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {habitacion.servicios.map((servicio, idx) => (
                        <div key={idx} className="flex items-center text-white/90 group">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                          <span className="text-lg group-hover:text-green-400 transition-colors duration-300">{servicio}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Precio y botón con animación */}
                  <div className={`flex flex-col md:flex-row items-start md:items-center gap-6 transition-all duration-1000 delay-1300 ${
                    index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}>
                    <div className="text-4xl font-bold text-green-400 flex items-center">
                      <HomeIcon className="w-8 h-8 mr-2" />
                      {habitacion.precio}
                    </div>
                    <Link
                      href="/reservar"
                      className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 border border-green-500/50"
                    >
                      <span className="flex items-center">
                        RESERVA YA
                        <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Controles de navegación mejorados */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 group"
        >
          <ChevronLeftIcon className="w-8 h-8 group-hover:-translate-x-1 transition-transform duration-300" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 group"
        >
          <ChevronRightIcon className="w-8 h-8 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Indicadores mejorados */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {habitacionesCarrusel.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-green-400 scale-125 shadow-lg shadow-green-400/50' 
                  : 'bg-white/50 hover:bg-white/75 hover:scale-110'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Sección de características del hotel */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              ¿Por qué elegir Hotel Paraíso Verde?
            </h2>
            <p className="text-xl text-green-300">
              Descubre las ventajas de hospedarte con nosotros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🏨</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                Habitaciones de Lujo
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Diseñadas para brindarte el máximo confort y elegancia con acabados premium y tecnología de vanguardia
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                Entorno Natural
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Rodeado de naturaleza exuberante y con vistas espectaculares que te conectan con la belleza natural
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                Servicio Premium
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Atención personalizada y servicios de primera clase que superan todas tus expectativas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 