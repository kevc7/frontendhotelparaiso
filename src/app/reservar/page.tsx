'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, UserGroupIcon, MagnifyingGlassIcon, StarIcon, WifiIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
  const [animateText, setAnimateText] = useState(false);
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
      today: today.toISOString().split('T')[0],
      tomorrow: tomorrow.toISOString().split('T')[0]
    };
  }

  // Cargar tipos de habitación al montar el componente
  useEffect(() => {
    const fetchTiposHabitacion = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tipos-habitacion`);
        if (response.ok) {
          const data = await response.json();
          setTiposHabitacion(data.data || []);
        }
      } catch (error) {
        console.error('Error cargando tipos de habitación:', error);
      }
    };

    fetchTiposHabitacion();
  }, []);

  // Cargar habitaciones iniciales
  useEffect(() => {
    const cargarHabitacionesIniciales = async () => {
      try {
        setInitialLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/habitaciones`);
        if (response.ok) {
          const data = await response.json();
          setHabitacionesDisponibles(data.data || []);
        }
      } catch (error) {
        console.error('Error cargando habitaciones:', error);
        setError('Error al cargar las habitaciones');
      } finally {
        setInitialLoading(false);
        // Animar texto después de la carga
        setTimeout(() => setAnimateText(true), 500);
      }
    };

    cargarHabitacionesIniciales();
  }, []);

  const handleSearch = async () => {
    if (!searchData.checkIn || !searchData.checkOut) {
      setError('Por favor, selecciona las fechas de llegada y salida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        fecha_entrada: searchData.checkIn,
        fecha_salida: searchData.checkOut,
        numero_huespedes: searchData.guests.toString(),
        ...(searchData.roomType && { tipo_habitacion: searchData.roomType })
      });

      const response = await fetch(`${API_BASE_URL}/api/disponibilidad?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setHabitacionesDisponibles(data.data || []);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al buscar habitaciones');
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError('Error al buscar habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModal = (habitacion: any) => {
    if (!session) {
      setError('Debes iniciar sesión para hacer una reserva');
      return;
    }

    setHabitacionParaReservar(habitacion);
    setModalCheckIn(searchData.checkIn);
    setModalCheckOut(searchData.checkOut);
    setModalGuests(searchData.guests);
    setShowModal(true);
    setFormError('');
  };

  const calcularReserva = () => {
    if (!modalCheckIn || !modalCheckOut) return { noches: 0, total: 0 };

    const entrada = new Date(modalCheckIn);
    const salida = new Date(modalCheckOut);
    const noches = Math.ceil((salida.getTime() - entrada.getTime()) / (1000 * 60 * 60 * 24));
    const total = noches * habitacionParaReservar.precio_base;

    return { noches, total };
  };

  const recargarHabitaciones = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/habitaciones`);
      if (response.ok) {
        const data = await response.json();
        setHabitacionesDisponibles(data.data || []);
      }
    } catch (error) {
      console.error('Error recargando habitaciones:', error);
    }
  };

  const handleReservarConComprobante = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!comprobante) {
      setFormError('Por favor, selecciona un comprobante de pago');
      return;
    }

    const { noches, total } = calcularReserva();

    console.log('🚀 Iniciando proceso de reserva con comprobante:', {
      fechas: { modalCheckIn, modalCheckOut },
      huespedes: modalGuests,
      habitacion: habitacionParaReservar.id,
      calculo: { noches, total }
    });

    try {
      // Paso 1: Obtener cliente del usuario logueado
      console.log('👤 PASO 1: Obteniendo cliente para usuario:', session.user.id);
      console.log('🍪 Document cookies:', document.cookie);
      
      const clienteResponse = await fetch(`${API_BASE_URL}/api/clientes?usuario_id=${session.user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include' // Esto debería enviar automáticamente las cookies
      });
      console.log('📥 Respuesta cliente:', clienteResponse.status, clienteResponse.ok);
      
      if (!clienteResponse.ok) {
        const errorText = await clienteResponse.text();
        console.error('❌ Error en respuesta cliente:', errorText);
        throw new Error('Error al obtener información del cliente');
      }
      
      const clienteData = await clienteResponse.json();
      console.log('✅ Datos del cliente obtenidos:', clienteData);
      
      if (!clienteData.data || clienteData.data.length === 0) {
        console.error('❌ No se encontró cliente para el usuario');
        throw new Error('No se encontró un cliente asociado a tu usuario');
      }
      
      const cliente = clienteData.data[0];
      console.log('👤 Cliente seleccionado:', cliente.id);

      // Paso 2: Crear la reserva
      console.log('🏨 PASO 2: Creando reserva...');
      const reservaData = {
        cliente_id: cliente.id,
        fecha_entrada: modalCheckIn,
        fecha_salida: modalCheckOut,
        numero_huespedes: modalGuests,
        habitaciones: [habitacionParaReservar.id]
      };
      console.log('📋 Datos para crear reserva:', reservaData);

      const reservaResponse = await fetch(`${API_BASE_URL}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reservaData)
      });

      console.log('📥 Respuesta creación reserva:', reservaResponse.status, reservaResponse.ok);

      if (!reservaResponse.ok) {
        const errorData = await reservaResponse.json();
        console.error('❌ Error creando reserva:', errorData);
        throw new Error(errorData.message || 'Error al crear la reserva');
      }

      const reservaResult = await reservaResponse.json();
      console.log('✅ Reserva creada exitosamente:', reservaResult);

      // Paso 3: Subir comprobante de pago
      console.log('📄 PASO 3: Subiendo comprobante...');
      const comprobanteFormData = new FormData();
      comprobanteFormData.append('file', comprobante);
      comprobanteFormData.append('reserva_id', reservaResult.data.id.toString());
      comprobanteFormData.append('tipo_comprobante', tipoComprobante);
      comprobanteFormData.append('monto', total.toString());
      comprobanteFormData.append('fecha_pago', fechaPago);

      console.log('📋 Datos del comprobante:', {
        reserva_id: reservaResult.data.id,
        tipo_comprobante: tipoComprobante,
        monto: total,
        fecha_pago: fechaPago,
        archivo: comprobante.name
      });

      const comprobanteResponse = await fetch(`${API_BASE_URL}/api/comprobantes`, {
        method: 'POST',
        credentials: 'include',
        body: comprobanteFormData
      });

      console.log('📥 Respuesta subida comprobante:', comprobanteResponse.status, comprobanteResponse.ok);

      if (!comprobanteResponse.ok) {
        const errorText = await comprobanteResponse.text();
        console.error('❌ Error subiendo comprobante:', errorText);
        throw new Error('Error al subir el comprobante de pago');
      }

      const comprobanteResult = await comprobanteResponse.json();
      console.log('✅ Comprobante subido exitosamente:', comprobanteResult);

      setSuccess('Reserva creada y comprobante subido exitosamente. Espera la confirmación de tu reserva.');
      setShowModal(false);
      setHabitacionSeleccionada('');
      // Recargar habitaciones disponibles para reflejar la nueva reserva
      await recargarHabitaciones();

    } catch (error: any) {
      console.error('💥 Error en proceso de reserva:', error);
      setFormError(error.message || 'Error al procesar la reserva');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      {/* Mensaje de éxito moderno */}
      {success && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl border border-green-500/20">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h3 className="text-2xl font-bold text-green-400 mb-2">¡Reserva Exitosa!</h3>
            <p className="text-gray-300 mb-6">{success}</p>
            <button
              onClick={() => setSuccess('')}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Animación de carga inicial */}
      {initialLoading && (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-green-400 border-t-transparent animate-ping opacity-20"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 animate-pulse">Cargando Hotel Paraíso Verde</h3>
            <p className="text-green-400">Preparando tu experiencia...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header con animaciones */}
        <div className="text-center mb-12">
          <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 transition-all duration-1000 ${
            animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Reservar Habitación
          </h1>
          <p className={`text-xl md:text-2xl text-green-300 transition-all duration-1000 delay-300 ${
            animateText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Encuentra la habitación perfecta para tu estadía
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel de Búsqueda */}
          <div className="lg:w-1/3">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700 sticky top-4 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <MagnifyingGlassIcon className="w-6 h-6 mr-3 text-green-400" />
                Filtros de Búsqueda
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-green-400" />
                    Fecha de Llegada
                  </label>
                  <input
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-green-400" />
                    Fecha de Salida
                  </label>
                  <input
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                    min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-2 text-green-400" />
                    Número de Huéspedes
                  </label>
                  <select
                    value={searchData.guests}
                    onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="1">1 huésped</option>
                    <option value="2">2 huéspedes</option>
                    <option value="3">3 huéspedes</option>
                    <option value="4">4 huéspedes</option>
                    <option value="5">5 huéspedes</option>
                    <option value="6">6 huéspedes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Tipo de Habitación
                  </label>
                  <select
                    value={searchData.roomType}
                    onChange={(e) => setSearchData({...searchData, roomType: e.target.value})}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Cualquier tipo</option>
                    {tiposHabitacion.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Buscando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                      Buscar Habitaciones
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Cuadrícula de habitaciones */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
                  <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-green-400 border-t-transparent animate-ping opacity-20"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Buscando habitaciones...</h3>
                <p className="text-green-300">Un momento por favor</p>
              </div>
            ) : habitacionesDisponibles.length > 0 ? (
              <div>
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <HomeIcon className="w-6 h-6 mr-3 text-green-400" />
                  Habitaciones Disponibles ({habitacionesDisponibles.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
                  {habitacionesDisponibles.map((hab, index) => (
                    <div 
                      key={hab.id} 
                      className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl overflow-hidden hover:shadow-green-500/25 border border-gray-700 hover:border-green-500 transition-all duration-500 transform hover:scale-[1.03] flex flex-col min-h-[420px] max-w-[420px] mx-auto"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Imagen de la habitación */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={getHabitacionImage(hab.tipo_nombre)}
                          alt={`Habitación ${hab.tipo_nombre}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753089234/descarga_18_fvcaxx.jpg';
                          }}
                        />
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                          {hab.numero}
                        </div>
                        <div className="absolute bottom-4 left-4 bg-green-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          <StarIcon className="w-4 h-4 inline mr-1" />
                          {hab.capacidad_maxima} personas
                        </div>
                      </div>
                      {/* Contenido de la card */}
                      <div className="flex flex-col flex-1 p-7 gap-3 justify-between">
                        <div>
                          <h4 className="font-bold text-2xl mb-2 text-white group-hover:text-green-400 transition-colors duration-300 truncate">
                            {hab.tipo_nombre}
                          </h4>
                          <div className="text-base text-gray-300 mb-2 line-clamp-2 min-h-[2.5rem]">
                            {hab.servicios && typeof hab.servicios === 'string' 
                              ? hab.servicios.split(',').slice(0, 3).join(', ')
                              : 'Servicios básicos'}
                          </div>
                        </div>
                        <div className="flex items-end justify-between mt-auto pt-2">
                          <div className="text-2xl font-bold text-green-400 whitespace-nowrap">
                            ${hab.precio_base}/noche
                          </div>
                          <button
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3 px-7 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 font-semibold text-lg"
                            onClick={() => handleAbrirModal(hab)}
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🏨</div>
                <h3 className="text-3xl font-bold text-white mb-4">No hay habitaciones disponibles</h3>
                <p className="text-green-300 text-lg">Intenta con otras fechas o tipos de habitación</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Modal de reserva */}
        <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-auto p-8 z-10 border border-gray-700">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" onClick={() => setShowModal(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
              <Dialog.Title className="text-3xl font-bold mb-6 text-center text-white">Confirmar Reserva</Dialog.Title>
              
              {habitacionParaReservar && (
                <div className="mb-6">
                  {/* Imagen de la habitación en el modal */}
                  <div className="mb-6">
                    <img
                      src={getHabitacionImage(habitacionParaReservar.tipo_nombre)}
                      alt={`Habitación ${habitacionParaReservar.tipo_nombre}`}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  
                  <form onSubmit={handleReservarConComprobante} className="space-y-6">
                    <div className="bg-gray-700/50 p-4 rounded-xl">
                      <div className="font-bold text-xl text-white mb-2">{habitacionParaReservar.tipo_nombre}</div>
                      <div className="text-gray-300">Habitación {habitacionParaReservar.numero}</div>
                    </div>
                    
                    {/* Campos de fecha editables */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-2 text-sm text-gray-300">Fecha de Entrada *</label>
                        <input
                          type="date"
                          value={modalCheckIn}
                          onChange={(e) => setModalCheckIn(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-2 text-sm text-gray-300">Fecha de Salida *</label>
                        <input
                          type="date"
                          value={modalCheckOut}
                          onChange={(e) => setModalCheckOut(e.target.value)}
                          min={modalCheckIn || new Date().toISOString().split('T')[0]}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-300">Número de Huéspedes *</label>
                      <select
                        value={modalGuests}
                        onChange={(e) => setModalGuests(parseInt(e.target.value))}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                        required
                      >
                        {[...Array(habitacionParaReservar.capacidad_maxima)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} huésped{i > 0 ? 'es' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cálculo dinámico */}
                    {modalCheckIn && modalCheckOut && (
                      <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 p-6 rounded-xl border border-green-500/20">
                        <div className="flex justify-between mb-3">
                          <span className="text-gray-300">Noches:</span>
                          <span className="font-semibold text-white">{calcularReserva().noches}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                          <span className="text-gray-300">Precio por noche:</span>
                          <span className="font-semibold text-white">${habitacionParaReservar.precio_base}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t border-green-500/30 pt-3">
                          <span className="text-white">Total:</span>
                          <span className="text-green-400">${calcularReserva().total}</span>
                        </div>
                      </div>
                    )}

                    {/* Campos del comprobante */}
                    <div className="border-t border-gray-700 pt-6">
                      <h4 className="font-bold text-xl mb-4 text-white">Información del Pago</h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block font-semibold mb-2 text-sm text-gray-300">Método de Pago *</label>
                          <select
                            value={tipoComprobante}
                            onChange={(e) => setTipoComprobante(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            required
                          >
                            <option value="transferencia">Transferencia Bancaria</option>
                            <option value="deposito">Depósito Bancario</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block font-semibold mb-2 text-sm text-gray-300">Fecha de Pago *</label>
                          <input
                            type="date"
                            value={fechaPago}
                            onChange={(e) => setFechaPago(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                            required
                          />
                        </div>
                      </div>

                      {/* Información bancaria dinámica */}
                      {getInformacionBancaria(tipoComprobante) && (
                        <div className="mb-4 p-6 bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-500/20 rounded-xl">
                          <h5 className="font-bold text-blue-300 mb-4 flex items-center">
                            <WifiIcon className="w-5 h-5 mr-2" />
                            {getInformacionBancaria(tipoComprobante)?.titulo}
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Banco:</span>
                              <span className="font-medium text-white">{getInformacionBancaria(tipoComprobante)?.banco}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Cuenta:</span>
                              <span className="font-medium text-white">{getInformacionBancaria(tipoComprobante)?.cuenta}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tipo:</span>
                              <span className="font-medium text-white">{getInformacionBancaria(tipoComprobante)?.tipo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Titular:</span>
                              <span className="font-medium text-white">{getInformacionBancaria(tipoComprobante)?.titular}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">CCI:</span>
                              <span className="font-medium font-mono text-white">{getInformacionBancaria(tipoComprobante)?.cci}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="block font-semibold mb-2 text-sm text-gray-300">Comprobante de Pago *</label>
                        <input
                          type="file"
                          onChange={(e) => setComprobante(e.target.files?.[0] || null)}
                          accept="image/*,.pdf"
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500"
                          required
                        />
                        <p className="text-xs text-gray-400 mt-2">
                          Formatos permitidos: JPG, PNG, PDF (máx. 10MB)
                        </p>
                      </div>
                    </div>

                    {formError && (
                      <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                        {formError}
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!modalCheckIn || !modalCheckOut || !comprobante}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        Confirmar Reserva
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
} 