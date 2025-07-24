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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
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
          {/* Overlay gradient mejorado */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
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

      {/* Sección de Servicios */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Bienvenido al Paraíso
            </h2>
            <p className="text-xl md:text-2xl text-green-300 max-w-3xl mx-auto">
              Un refugio donde la elegancia se encuentra con la naturaleza, 
              creando experiencias extraordinarias que perduran en el tiempo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Habitaciones Elegantes */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500 transition-all duration-500 transform hover:scale-105">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/habelegante.webp"
                  alt="Habitación Elegante"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-600 p-2 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                  Habitaciones Elegantes
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Disfruta de espacios diseñados con elegancia y confort, 
                  donde cada detalle está pensado para tu bienestar.
                </p>
              </div>
            </div>

            {/* Gastronomía de Autor */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500 transition-all duration-500 transform hover:scale-105">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/gastronomiadeautor.jpeg"
                  alt="Gastronomía de Autor"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-600 p-2 rounded-lg">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                  Gastronomía de Autor
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Saborea platos únicos creados por nuestros chefs expertos, 
                  fusionando sabores locales con técnicas internacionales.
                </p>
              </div>
            </div>

            {/* Naturaleza Pura */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500 transition-all duration-500 transform hover:scale-105">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/naturalezapura.jpeg"
                  alt="Naturaleza Pura"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-green-600 p-2 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                  Naturaleza Pura
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Conecta con la belleza natural que nos rodea, 
                  en un entorno donde la paz y la tranquilidad reinan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Características */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-green-300">
              Descubre lo que nos hace únicos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <WifiIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                WiFi Gratuito
              </h3>
              <p className="text-gray-300">
                Conectividad de alta velocidad en todas las áreas
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <SunIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                Clima Perfecto
              </h3>
              <p className="text-gray-300">
                Temperatura ideal durante todo el año
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TruckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                Estacionamiento
              </h3>
              <p className="text-gray-300">
                Estacionamiento seguro y gratuito
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-600 to-green-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <WrenchScrewdriverIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors duration-300">
                Servicio 24/7
              </h3>
              <p className="text-gray-300">
                Atención personalizada en todo momento
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
