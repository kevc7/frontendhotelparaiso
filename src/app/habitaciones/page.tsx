'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface Habitacion {
  id: number;
  numero: string;
  piso: number;
  estado: string;
  precio_noche: number;
  tipo_id: number;
  tipo_nombre: string;
  tipo_descripcion: string;
  capacidad_maxima: number;
  servicios: string;
}

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/habitaciones`);
        if (!response.ok) {
          throw new Error('Error al cargar habitaciones');
        }
        const data = await response.json();
        setHabitaciones(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Error al cargar habitaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchHabitaciones();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestras Habitaciones
          </h1>
          <p className="text-xl text-gray-600">
            Descubre el confort y la elegancia en cada una de nuestras habitaciones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {habitaciones.map((habitacion) => (
            <div
              key={habitacion.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Habitación {habitacion.numero}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    habitacion.estado === 'libre' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {habitacion.estado === 'libre' ? 'Disponible' : 'Ocupada'}
                  </span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {habitacion.tipo_nombre}
                  </h4>
                  <p className="text-gray-600 mb-3">
                    {habitacion.tipo_descripcion}
                  </p>
                  <p className="text-green-600 font-bold text-xl">
                    ${habitacion.precio_noche}/noche
                  </p>
                </div>

                <div className="mb-4">
                  <h5 className="font-semibold text-gray-800 mb-2">Servicios incluidos:</h5>
                  <p className="text-sm text-gray-600">
                    {habitacion.servicios}
                  </p>
                </div>

                <div className="text-sm text-gray-500">
                  Piso {habitacion.piso} • Capacidad: {habitacion.capacidad_maxima} personas
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 