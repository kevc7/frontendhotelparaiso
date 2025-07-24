'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, UserGroupIcon, MagnifyingGlassIcon, StarIcon, WifiIcon, HomeIcon, CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

// Configuración de API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad_maxima: number;
  precio_base: number;
  servicios: string;
}

// Función para obtener la imagen según el tipo de habitación
function getHabitacionImage(tipoNombre: string): string {
  const tipoLower = tipoNombre.toLowerCase();
  
  if (tipoLower.includes('estándar') || tipoLower.includes('estandar')) {
    return 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753089234/descarga_18_fvcaxx.jpg';
  } else if (tipoLower.includes('doble superior')) {
    return 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753090132/descarga_19_rb547y.jpg';
  } else if (tipoLower.includes('suite familiar') || tipoLower.includes('familiar')) {
    return 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753090210/Habitaci%C3%B3n_Familiar_con_cama_matrimonial_camarote_lh7erd.jpg';
  } else if (tipoLower.includes('suite presidencial') || tipoLower.includes('presidencial')) {
    return 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753090640/ChatGPT_Image_21_jul_2025_04_37_12_wu6psg.png';
  } else if (tipoLower.includes('suite premium') || tipoLower.includes('premium')) {
    return 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753090717/descarga_20_ovmb2q.jpg';
  }
  
  // Imagen por defecto si no coincide ningún tipo
  return 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753089234/descarga_18_fvcaxx.jpg';
}

export default function ReservarPage() {
  const { data: session, status } = useSession();
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomType: ''
  });
  const [tiposHabitacion, setTiposHabitacion] = useState<TipoHabitacion[]>([]);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState<any[]>([]);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [habitacionParaReservar, setHabitacionParaReservar] = useState<any>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [animateContent, setAnimateContent] = useState(false);
  
  // Nuevo estado para los campos del comprobante
  const [tipoComprobante, setTipoComprobante] = useState('transferencia');
  const [fechaPago, setFechaPago] = useState(() => new Date().toISOString().slice(0, 10));
  
  // Estados para fechas del modal (independientes del filtro)
  const [modalCheckIn, setModalCheckIn] = useState('');
  const [modalCheckOut, setModalCheckOut] = useState('');
  const [modalGuests, setModalGuests] = useState(1);

  // Información bancaria según el método de pago
  const getInformacionBancaria = (metodo: string) => {
    switch (metodo) {
      case 'transferencia':
        return {
          titulo: 'Transferencia Bancaria',
          banco: 'Banco Pichincha',
          cuenta: '2100123456',
          tipo: 'Cuenta Corriente',
          titular: 'HOTEL PARAÍSO VERDE S.A.',
          cci: '00212321001234567890'
        };
      case 'deposito':
        return {
          titulo: 'Depósito Bancario',
          banco: 'Banco Pichincha',
          cuenta: '2100123456',
          tipo: 'Cuenta Corriente',
          titular: 'HOTEL PARAÍSO VERDE S.A.',
          cci: '00212321001234567890'
        };
      default:
        return null;
    }
  };

  // Función para obtener la fecha de hoy y mañana en formato YYYY-MM-DD
  function getDefaultDates() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return {
      today: today.toISOString().slice(0, 10),
      tomorrow: tomorrow.toISOString().slice(0, 10)
    };
  }

  // Cargar tipos de habitación al montar el componente
  useEffect(() => {
    const fetchTiposHabitacion = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tipos-habitacion`);
        if (!response.ok) {
          throw new Error('Error al cargar tipos de habitación');
        }
        const data = await response.json();
        setTiposHabitacion(data.data || []);
      } catch (err: any) {
        console.error('Error:', err);
      }
    };

    fetchTiposHabitacion();
  }, []);

  // Cargar habitaciones iniciales
  useEffect(() => {
    const cargarHabitacionesIniciales = async () => {
      try {
        setInitialLoading(true);
        console.log('Cargando habitaciones iniciales...');
        const response = await fetch(`${API_BASE_URL}/api/habitaciones`);
        if (!response.ok) {
          throw new Error('Error al cargar habitaciones');
        }
        const data = await response.json();
        console.log('Datos de habitaciones iniciales:', data);
        console.log('Primera habitación como ejemplo:', data.data?.[0]);
        setHabitacionesDisponibles(data.data || []);
      } catch (err: any) {
        console.error('Error al cargar habitaciones iniciales:', err);
      } finally {
        setInitialLoading(false);
        // Animar contenido después de la carga
        setTimeout(() => setAnimateContent(true), 500);
      }
    };

    cargarHabitacionesIniciales();
  }, []);

  const handleSearch = async () => {
    if (!searchData.checkIn || !searchData.checkOut) {
      setError('Por favor, selecciona las fechas de llegada y salida');
      return;
    }

    if (new Date(searchData.checkIn) >= new Date(searchData.checkOut)) {
      setError('La fecha de salida debe ser posterior a la fecha de llegada');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        guests: searchData.guests.toString(),
        ...(searchData.roomType && { roomType: searchData.roomType })
      });

      console.log('Buscando habitaciones con parámetros:', params.toString());
      const response = await fetch(`${API_BASE_URL}/api/disponibilidad?${params}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar disponibilidad');
      }

      const data = await response.json();
      console.log('Datos de disponibilidad recibidos:', data);
      console.log('Primera habitación disponible como ejemplo:', data.data?.[0]);
      setHabitacionesDisponibles(data.data || []);
    } catch (err: any) {
      console.error('Error en búsqueda de habitaciones:', err);
      setError(err.message || 'Error al buscar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (habitacion: any) => {
    setHabitacionParaReservar(habitacion);
    setModalCheckIn(searchData.checkIn);
    setModalCheckOut(searchData.checkOut);
    setModalGuests(searchData.guests);
    setShowModal(true);
  };

  const calcularReserva = () => {
    if (!habitacionParaReservar || !modalCheckIn || !modalCheckOut) {
      console.log('Datos faltantes para calcular reserva:', {
        habitacionParaReservar,
        modalCheckIn,
        modalCheckOut
      });
      return 0;
    }
    
    const checkIn = new Date(modalCheckIn);
    const checkOut = new Date(modalCheckOut);
    const dias = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    // Verificar la estructura de datos de la habitación
    console.log('Datos de habitación para calcular precio:', habitacionParaReservar);
    
    // Intentar diferentes propiedades para el precio
    const precio = habitacionParaReservar.precio_noche || 
                   habitacionParaReservar.precio || 
                   habitacionParaReservar.precio_base || 
                   0;
    
    console.log('Precio calculado:', precio, 'Días:', dias, 'Total:', dias * precio);
    
    return dias * precio;
  };

  const recargarHabitaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/habitaciones`);
      if (!response.ok) {
        throw new Error('Error al recargar habitaciones');
      }
      const data = await response.json();
      console.log('Datos de habitaciones recibidos:', data);
      setHabitacionesDisponibles(data.data || []);
    } catch (err: any) {
      console.error('Error al recargar habitaciones:', err);
      setError(err.message || 'Error al recargar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleReservarConComprobante = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comprobante) {
      setFormError('Por favor, selecciona un comprobante de pago');
      return;
    }

    if (!modalCheckIn || !modalCheckOut) {
      setFormError('Por favor, completa las fechas de la reserva');
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('reservaId', habitacionParaReservar.id.toString());
      formData.append('metodoPago', tipoComprobante);
      formData.append('monto', calcularReserva().toString());
      formData.append('fechaPago', fechaPago);
      formData.append('file', comprobante);

      const response = await fetch(`${API_BASE_URL}/api/comprobantes`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar la reserva');
      }

      setSuccess('¡Reserva realizada con éxito! Te hemos enviado un email con los detalles.');
      setShowModal(false);
      setComprobante(null);
      setTipoComprobante('transferencia');
      setFechaPago(new Date().toISOString().slice(0, 10));
      
      // Recargar habitaciones después de la reserva
      setTimeout(() => {
        recargarHabitaciones();
      }, 2000);

    } catch (err: any) {
      setFormError(err.message || 'Error al procesar la reserva');
    } finally {
      setLoading(false);
    }
  };

  // Configurar fechas por defecto
  useEffect(() => {
    const { today, tomorrow } = getDefaultDates();
    setSearchData(prev => ({
      ...prev,
      checkIn: today,
      checkOut: tomorrow
    }));
  }, []);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-green-400 border-t-transparent animate-ping opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">Cargando Habitaciones</h3>
          <p className="text-green-400">Buscando las mejores opciones para ti...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      {/* Header con animación */}
      <div className="relative py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 ${
            animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Reservar Habitación
            </h1>
            <p className="text-xl md:text-2xl text-green-300 max-w-3xl mx-auto">
              Encuentra la habitación perfecta para tu estadía y reserva con facilidad
            </p>
          </div>

          {/* Filtros con animación */}
          <div className={`max-w-4xl mx-auto mb-12 transition-all duration-1000 delay-300 ${
            animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MagnifyingGlassIcon className="w-6 h-6 text-green-400 mr-3" />
                Filtros de Búsqueda
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Fecha de Llegada */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Fecha de Llegada
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Fecha de Salida */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Fecha de Salida
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Número de Huéspedes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Huéspedes
                  </label>
                  <div className="relative">
                    <UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <select
                      value={searchData.guests}
                      onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num} className="bg-gray-800 text-white">
                          {num} {num === 1 ? 'huésped' : 'huéspedes'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tipo de Habitación */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Tipo de Habitación
                  </label>
                  <div className="relative">
                    <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    <select
                      value={searchData.roomType}
                      onChange={(e) => setSearchData({...searchData, roomType: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    >
                      <option value="" className="bg-gray-800 text-white">Cualquier tipo</option>
                      {tiposHabitacion.map(tipo => (
                        <option key={tipo.id} value={tipo.nombre} className="bg-gray-800 text-white">
                          {tipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Botón de búsqueda */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 border border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                    )}
                    {loading ? 'Buscando...' : 'Buscar Habitaciones'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="max-w-4xl mx-auto mb-6">
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                {error}
              </div>
            </div>
          )}

          {/* Grid de habitaciones */}
          <div className={`transition-all duration-1000 delay-500 ${
            animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Habitaciones Disponibles ({habitacionesDisponibles.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {habitacionesDisponibles.map((habitacion, index) => (
                <div
                  key={habitacion.id}
                  className={`group bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 ${
                    animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Imagen de la habitación */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getHabitacionImage(habitacion.tipo_nombre)}
                      alt={habitacion.tipo_nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Habitación {habitacion.numero}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      {habitacion.estado === 'libre' ? 'Disponible' : 'Ocupada'}
                    </div>
                  </div>

                  {/* Contenido de la habitación */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300">
                      {habitacion.tipo_nombre}
                    </h3>
                    
                    <div className="flex items-center text-gray-300 mb-3">
                      <UserGroupIcon className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-sm">{habitacion.capacidad_maxima} personas</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Servicios incluidos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {habitacion.servicios.split(',').slice(0, 3).map((servicio, idx) => (
                          <span key={idx} className="bg-green-600/20 text-green-300 px-2 py-1 rounded-full text-xs">
                            {servicio.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-green-400">
                        ${habitacion.precio_noche || habitacion.precio || habitacion.precio_base || 0}/noche
                      </div>
                      <button
                        onClick={() => handleAbrirModal(habitacion)}
                        disabled={habitacion.estado !== 'libre'}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {habitacionesDisponibles.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-2xl font-bold text-white mb-2">No hay habitaciones disponibles</h3>
                <p className="text-gray-300">Intenta con otras fechas o criterios de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de reserva */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-2xl font-bold text-white">
                  Confirmar Reserva
                </Dialog.Title>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {habitacionParaReservar && (
                <div className="space-y-6">
                  {/* Información de la habitación */}
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {habitacionParaReservar.tipo_nombre}
                    </h3>
                    <p className="text-gray-300 text-sm mb-2">
                      Habitación {habitacionParaReservar.numero}
                    </p>
                    <p className="text-green-400 font-semibold">
                      ${habitacionParaReservar.precio_noche || habitacionParaReservar.precio || habitacionParaReservar.precio_base || 0}/noche
                    </p>
                  </div>

                  {/* Fechas de la reserva */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha de Llegada
                      </label>
                      <input
                        type="date"
                        value={modalCheckIn}
                        onChange={(e) => setModalCheckIn(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha de Salida
                      </label>
                      <input
                        type="date"
                        value={modalCheckOut}
                        onChange={(e) => setModalCheckOut(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Total de la reserva */}
                  <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total de la reserva:</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${calcularReserva()}
                      </span>
                    </div>
                  </div>

                  {/* Formulario de comprobante */}
                  <form onSubmit={handleReservarConComprobante} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Método de Pago
                      </label>
                      <select
                        value={tipoComprobante}
                        onChange={(e) => setTipoComprobante(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      >
                        <option value="transferencia" className="bg-gray-800 text-white">
                          Transferencia Bancaria
                        </option>
                        <option value="deposito" className="bg-gray-800 text-white">
                          Depósito Bancario
                        </option>
                      </select>
                    </div>

                    {/* Información bancaria */}
                    {getInformacionBancaria(tipoComprobante) && (
                      <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <h4 className="text-white font-semibold mb-3 flex items-center">
                          <BanknotesIcon className="w-5 h-5 text-green-400 mr-2" />
                          {getInformacionBancaria(tipoComprobante)?.titulo}
                        </h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p><span className="font-semibold">Banco:</span> {getInformacionBancaria(tipoComprobante)?.banco}</p>
                          <p><span className="font-semibold">Cuenta:</span> {getInformacionBancaria(tipoComprobante)?.cuenta}</p>
                          <p><span className="font-semibold">Tipo:</span> {getInformacionBancaria(tipoComprobante)?.tipo}</p>
                          <p><span className="font-semibold">Titular:</span> {getInformacionBancaria(tipoComprobante)?.titular}</p>
                          <p><span className="font-semibold">CCI:</span> {getInformacionBancaria(tipoComprobante)?.cci}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha de Pago
                      </label>
                      <input
                        type="date"
                        value={fechaPago}
                        onChange={(e) => setFechaPago(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Comprobante de Pago
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setComprobante(e.target.files?.[0] || null)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500"
                      />
                    </div>

                    {formError && (
                      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-300">
                        {formError}
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Procesando...' : 'Confirmar Reserva'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal de éxito */}
      {success && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full text-center border border-gray-700">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">¡Reserva Exitosa!</h3>
            <p className="text-gray-300 mb-6">{success}</p>
            <button
              onClick={() => setSuccess('')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 