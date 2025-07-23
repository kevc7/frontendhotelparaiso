'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [habitacionParaReservar, setHabitacionParaReservar] = useState<any>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  // Nuevo estado para los campos del comprobante
  const [tipoComprobante, setTipoComprobante] = useState('transferencia');
  const [fechaPago, setFechaPago] = useState(() => new Date().toISOString().slice(0, 10));
  
  // Estados para fechas del modal (independientes del filtro)
  const [modalCheckIn, setModalCheckIn] = useState('');
  const [modalCheckOut, setModalCheckOut] = useState('');
  const [modalGuests, setModalGuests] = useState(1);

  // Función para obtener la fecha de hoy y mañana en formato YYYY-MM-DD
  function getDefaultDates() {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    return {
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0]
    };
  }

  // Cargar tipos de habitación al montar el componente
  useEffect(() => {
    const fetchTiposHabitacion = async () => {
      try {
        console.log('🔍 Cargando tipos de habitación desde:', `${API_BASE_URL}/api/tipos-habitacion`);
        const response = await fetch(`${API_BASE_URL}/api/tipos-habitacion`);
        console.log('📥 Respuesta tipos habitación:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Tipos de habitación cargados:', data);
          setTiposHabitacion(data.data || []);
        } else {
          console.error('❌ Error en respuesta tipos habitación:', response.status);
          setError('Error al cargar tipos de habitación');
        }
      } catch (error) {
        console.error('💥 Error cargando tipos de habitación:', error);
        setError('Error de conexión al cargar tipos de habitación');
      }
    };

    fetchTiposHabitacion();
  }, []);

  // Cargar habitaciones disponibles por defecto al montar el componente
  useEffect(() => {
    const cargarHabitacionesIniciales = async () => {
      console.log('🏨 Cargando habitaciones disponibles iniciales...');
      const defaultDates = getDefaultDates();
      
      try {
        const url = `${API_BASE_URL}/api/disponibilidad?fecha_checkin=${defaultDates.checkIn}&fecha_checkout=${defaultDates.checkOut}`;
        console.log('🔍 Consultando disponibilidad en:', url);
        
        const response = await fetch(url);
        console.log('📥 Respuesta disponibilidad:', response.status, response.ok);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Habitaciones disponibles:', data);
          setHabitacionesDisponibles(data.data || []);
          
          // Pre-llenar las fechas por defecto
          setSearchData(prev => ({
            ...prev,
            checkIn: defaultDates.checkIn,
            checkOut: defaultDates.checkOut
          }));
        } else {
          console.error('❌ Error en respuesta disponibilidad:', response.status);
        }
      } catch (error) {
        console.error('💥 Error cargando habitaciones iniciales:', error);
      }
    };

    cargarHabitacionesIniciales();
  }, []);

  // Buscar habitaciones disponibles
  const handleSearch = async () => {
    console.log('🔍 Iniciando búsqueda con datos:', searchData);
    
    if (!searchData.checkIn || !searchData.checkOut) {
      setError('Por favor selecciona las fechas de entrada y salida');
      return;
    }

    if (new Date(searchData.checkIn) >= new Date(searchData.checkOut)) {
      setError('La fecha de salida debe ser posterior a la fecha de entrada');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let url = `${API_BASE_URL}/api/disponibilidad?fecha_checkin=${searchData.checkIn}&fecha_checkout=${searchData.checkOut}`;
      
      if (searchData.roomType) {
        url += `&tipo_habitacion_id=${searchData.roomType}`;
      }

      console.log('🔍 Buscando en URL:', url);
      const response = await fetch(url);
      console.log('📥 Respuesta búsqueda:', response.status, response.ok);
      
      const data = await response.json();
      console.log('📊 Datos recibidos:', data);
      
      if (response.ok) {
        setHabitacionesDisponibles(data.data || []);
        if ((data.data || []).length === 0) {
          setError('No hay habitaciones disponibles para los criterios seleccionados');
        }
      } else {
        console.error('❌ Error en búsqueda:', data);
        setError('Error al buscar habitaciones disponibles');
      }
    } catch (error) {
      console.error('💥 Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Función para abrir el modal de reserva
  const handleAbrirModal = (habitacion: any) => {
    setHabitacionParaReservar(habitacion);
    
    // Pre-llenar fechas del modal con datos de búsqueda o fechas por defecto
    const defaultDates = getDefaultDates();
    setModalCheckIn(searchData.checkIn || defaultDates.checkIn);
    setModalCheckOut(searchData.checkOut || defaultDates.checkOut);
    setModalGuests(searchData.guests || 1);
    
    setShowModal(true);
    setFormError('');
  };

  // Función para calcular noches y total
  const calcularReserva = () => {
    if (!modalCheckIn || !modalCheckOut || !habitacionParaReservar) {
      return { noches: 0, total: 0 };
    }

    const fechaEntrada = new Date(modalCheckIn);
    const fechaSalida = new Date(modalCheckOut);
    const noches = Math.ceil((fechaSalida.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60 * 24));
    const total = noches * habitacionParaReservar.precio_base;

    return { noches: Math.max(0, noches), total: Math.max(0, total) };
  };

  // Función para recargar habitaciones después de una reserva exitosa
  const recargarHabitaciones = async () => {
    try {
      const checkIn = searchData.checkIn || getDefaultDates().checkIn;
      const checkOut = searchData.checkOut || getDefaultDates().checkOut;
      
      let url = `${API_BASE_URL}/api/disponibilidad?fecha_checkin=${checkIn}&fecha_checkout=${checkOut}`;
      if (searchData.roomType) url += `&tipo_habitacion_id=${searchData.roomType}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setHabitacionesDisponibles(data.data || []);
      }
    } catch (err) {
      console.error('Error recargando habitaciones:', err);
    }
  };

  // Manejar reserva con comprobante
  const handleReservarConComprobante = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    console.log('🚀 Iniciando proceso de reserva...');

    if (!session?.user?.id) {
      setFormError('Debes estar logueado para hacer una reserva');
      return;
    }

    if (!modalCheckIn || !modalCheckOut) {
      setFormError('Por favor selecciona las fechas de entrada y salida');
      return;
    }

    if (new Date(modalCheckIn) >= new Date(modalCheckOut)) {
      setFormError('La fecha de salida debe ser posterior a la fecha de entrada');
      return;
    }

    if (!comprobante) {
      setFormError('Por favor adjunta el comprobante de pago');
      return;
    }

    const { noches, total } = calcularReserva();
    if (noches <= 0) {
      setFormError('Las fechas seleccionadas no son válidas');
      return;
    }

    console.log('✅ Validaciones iniciales pasadas');
    console.log('📊 Datos de reserva:', {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Encuentra tu habitación perfecta en el Hotel Paraíso Verde
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Panel de Búsqueda */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Filtros</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Fecha de Llegada
                </label>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Fecha de Salida
                </label>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                  min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserGroupIcon className="w-4 h-4 inline mr-1" />
                  Número de Huéspedes
                </label>
                <select
                  value={searchData.guests}
                  onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Habitación
                </label>
                <select
                  value={searchData.roomType}
                  onChange={(e) => setSearchData({...searchData, roomType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Cuadrícula de habitaciones */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold mb-2">Buscando habitaciones...</h3>
              <p>Un momento por favor</p>
            </div>
          ) : habitacionesDisponibles.length > 0 ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Habitaciones Disponibles ({habitacionesDisponibles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habitacionesDisponibles.map((hab) => (
                  <div key={hab.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Imagen de la habitación */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getHabitacionImage(hab.tipo_nombre)}
                        alt={`Habitación ${hab.tipo_nombre}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback en caso de error al cargar la imagen
                          e.currentTarget.src = 'https://res.cloudinary.com/dqwztjdcz/image/upload/v1753089234/descarga_18_fvcaxx.jpg';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {hab.numero}
                      </div>
                    </div>
                    
                    {/* Contenido de la card */}
                    <div className="p-5 flex flex-col justify-between h-40">
                      <div>
                        <h4 className="font-bold text-lg mb-2 text-gray-800">{hab.tipo_nombre}</h4>
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="inline-block mr-3">👥 {hab.capacidad_maxima} personas</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {hab.servicios && typeof hab.servicios === 'string' 
                            ? hab.servicios.split(',').slice(0, 3).join(', ')
                            : 'Servicios básicos'
                          }
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-green-600">
                          ${hab.precio_base}/noche
                        </div>
                        <button
                          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
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
            <div className="text-gray-500 text-center mt-16">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-xl font-semibold mb-2">No hay habitaciones disponibles</h3>
              <p>Intenta con otras fechas o tipos de habitación</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de reserva */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-auto p-8 z-10">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <Dialog.Title className="text-2xl font-bold mb-4 text-center">Confirmar Reserva</Dialog.Title>
            
            {habitacionParaReservar && (
              <div className="mb-6">
                {/* Imagen de la habitación en el modal */}
                <div className="mb-4">
                  <img
                    src={getHabitacionImage(habitacionParaReservar.tipo_nombre)}
                    alt={`Habitación ${habitacionParaReservar.tipo_nombre}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                
                <form onSubmit={handleReservarConComprobante} className="space-y-4">
                  <div>
                    <div className="font-semibold text-lg">{habitacionParaReservar.tipo_nombre}</div>
                    <div className="text-gray-600">Habitación {habitacionParaReservar.numero}</div>
                  </div>
                  
                  {/* Campos de fecha editables */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1 text-sm">Fecha de Entrada *</label>
                      <input
                        type="date"
                        value={modalCheckIn}
                        onChange={(e) => setModalCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-sm">Fecha de Salida *</label>
                      <input
                        type="date"
                        value={modalCheckOut}
                        onChange={(e) => setModalCheckOut(e.target.value)}
                        min={modalCheckIn || new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-sm">Número de Huéspedes *</label>
                    <select
                      value={modalGuests}
                      onChange={(e) => setModalGuests(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Noches:</span>
                        <span className="font-semibold">{calcularReserva().noches}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Precio por noche:</span>
                        <span className="font-semibold">${habitacionParaReservar.precio_base}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span className="text-green-600">${calcularReserva().total}</span>
                      </div>
                    </div>
                  )}

                  {/* Campos del comprobante */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Información del Pago</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1 text-sm">Método de Pago *</label>
                        <select
                          value={tipoComprobante}
                          onChange={(e) => setTipoComprobante(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        >
                          <option value="transferencia">Transferencia Bancaria</option>
                          <option value="deposito">Depósito Bancario</option>
                          <option value="pago_movil">Pago Móvil</option>
                          <option value="efectivo">Efectivo</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block font-semibold mb-1 text-sm">Fecha de Pago *</label>
                        <input
                          type="date"
                          value={fechaPago}
                          onChange={(e) => setFechaPago(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block font-semibold mb-1 text-sm">Comprobante de Pago *</label>
                      <input
                        type="file"
                        onChange={(e) => setComprobante(e.target.files?.[0] || null)}
                        accept="image/*,.pdf"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos permitidos: JPG, PNG, PDF (máx. 10MB)
                      </p>
                    </div>
                  </div>

                  {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                      {formError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={!modalCheckIn || !modalCheckOut || !comprobante}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
} 