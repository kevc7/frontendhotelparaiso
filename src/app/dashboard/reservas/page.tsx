"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { 
  ClipboardDocumentListIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Reserva {
  id: number;
  codigo_reserva: string;
  fecha_entrada: string;
  fecha_salida: string;
  estado: string;
  precio_total: number;
  numero_huespedes: number;
  fecha_creacion: string;
  cliente_id: number;
  cliente_nombre: string;
  cliente_apellido: string;
  cliente_email: string;
  cliente_telefono: string;
  total_habitaciones: number;
}

interface ReservaDetalle extends Reserva {
  habitaciones: Array<{
    id: number;
    numero: string;
    piso: number;
    tipo_nombre: string;
    precio_unitario: number;
    noches: number;
    subtotal: number;
  }>;
  comprobantes: Array<{
    id: number;
    metodo_pago: string;
    monto: number;
    estado: string;
    ruta_archivo: string;
    fecha_creacion: string;
  }>;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString('es-ES');
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default function ReservasDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservasFiltradas, setReservasFiltradas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<ReservaDetalle | null>(null);
  const [accionLoading, setAccionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("pendiente");

  // Verificar autenticación
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user?.role !== 'staff' && session.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchReservas();
  }, [session, status, router, filterEstado]);

  // Cargar reservas
  const fetchReservas = async () => {
    try {
      setLoading(true);
      const url = filterEstado 
        ? `${API_BASE_URL}/api/reservas?estado=${filterEstado}`
        : `${API_BASE_URL}/api/reservas`;
        
      const res = await fetch(url, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Error al cargar reservas');
      }
      
      const data = await res.json();
      setReservas(data.data || []);
      setReservasFiltradas(data.data || []);
    } catch (error) {
      console.error('Error fetching reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar reservas
  useEffect(() => {
    let filtered = reservas;

    if (searchTerm) {
      filtered = filtered.filter(reserva =>
        reserva.codigo_reserva.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.cliente_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.cliente_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setReservasFiltradas(filtered);
  }, [reservas, searchTerm]);

  // Obtener detalles de reserva
  const handleInspeccionarReserva = async (reservaId: number) => {
    setError("");
    setSuccess("");
    setModalOpen(true);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al obtener detalles");
      setReservaSeleccionada(data.data);
    } catch (err: any) {
      setError(err.message || "Error al obtener detalles de la reserva");
    }
  };

  // Confirmar reserva
  const handleConfirmarReserva = async (reservaId: number) => {
    if (!confirm('¿Confirmar esta reserva? Las habitaciones quedarán ocupadas.')) return;

    setAccionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          estado: "confirmada"
        }),
        credentials: 'include'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al confirmar reserva");
      
      setSuccess("Reserva confirmada exitosamente");
      setModalOpen(false);
      fetchReservas();
    } catch (err: any) {
      setError(err.message || "Error al confirmar reserva");
    } finally {
      setAccionLoading(false);
    }
  };

  // Rechazar reserva
  const handleRechazarReserva = async (reservaId: number) => {
    if (!confirm('¿Rechazar esta reserva? Esta acción no se puede deshacer.')) return;

    setAccionLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/reservas/${reservaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          estado: "cancelada"
        }),
        credentials: 'include'
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al rechazar reserva");
      
      setSuccess("Reserva rechazada exitosamente");
      setModalOpen(false);
      fetchReservas();
    } catch (err: any) {
      setError(err.message || "Error al rechazar reserva");
    } finally {
      setAccionLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user?.role !== 'staff' && session.user?.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-green-400/20 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-2">
            Gestión de Reservas
          </h1>
          <p className="text-gray-300">Administra y confirma las reservas del hotel</p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="mb-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 p-4 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-200 p-4 rounded-xl">
            {success}
          </div>
        )}

        {/* Filtros y Búsqueda */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
            >
              <option value="">Todas las reservas</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="cancelada">Canceladas</option>
            </select>

            {/* Contador */}
            <div className="flex items-center text-gray-300">
              <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
              <span>Total: {reservasFiltradas.length} reservas</span>
            </div>
          </div>
        </div>

        {/* Tabla de reservas */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5 border-b border-white/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fechas</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Habitaciones</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reservasFiltradas.map((reserva) => (
                  <tr key={reserva.id} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-white">{reserva.codigo_reserva}</div>
                      <div className="text-xs text-gray-400">ID: {reserva.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {reserva.cliente_nombre} {reserva.cliente_apellido}
                          </div>
                          <div className="text-sm text-gray-400">{reserva.cliente_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        <div>
                          <div>{formatDate(reserva.fecha_entrada)}</div>
                          <div className="text-xs text-gray-400">al {formatDate(reserva.fecha_salida)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-300">
                        <HomeIcon className="w-4 h-4 mr-1" />
                        <span>{reserva.total_habitaciones} habitación(es)</span>
                      </div>
                      <div className="text-xs text-gray-400">{reserva.numero_huespedes} huésped(es)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        reserva.estado === 'pendiente' 
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        reserva.estado === 'confirmada' 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                          'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {reserva.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-white">
                        <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                        {formatCurrency(reserva.precio_total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleInspeccionarReserva(reserva.id)}
                        className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors duration-200 border border-blue-500/30 flex items-center space-x-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {reservasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <ClipboardDocumentListIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No se encontraron reservas</p>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {reservaSeleccionada ? (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Reserva {reservaSeleccionada.codigo_reserva}
                    </h2>
                    <p className="text-gray-300">
                      Cliente: {reservaSeleccionada.cliente_nombre} {reservaSeleccionada.cliente_apellido}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    reservaSeleccionada.estado === 'pendiente' 
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                    reservaSeleccionada.estado === 'confirmada' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {reservaSeleccionada.estado}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Información de la reserva */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Detalles de la Reserva</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fecha entrada:</span>
                        <span className="text-white">{formatDate(reservaSeleccionada.fecha_entrada)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fecha salida:</span>
                        <span className="text-white">{formatDate(reservaSeleccionada.fecha_salida)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Huéspedes:</span>
                        <span className="text-white">{reservaSeleccionada.numero_huespedes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="text-white font-semibold">{formatCurrency(reservaSeleccionada.precio_total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Información del cliente */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Información del Cliente</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{reservaSeleccionada.cliente_email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Teléfono:</span>
                        <span className="text-white">{reservaSeleccionada.cliente_telefono || 'No especificado'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Habitaciones */}
                {reservaSeleccionada.habitaciones && reservaSeleccionada.habitaciones.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Habitaciones Reservadas</h3>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="space-y-3">
                        {reservaSeleccionada.habitaciones.map((habitacion) => (
                          <div key={habitacion.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                            <div>
                              <span className="text-white font-medium">Habitación {habitacion.numero}</span>
                              <span className="text-gray-400 ml-2">({habitacion.tipo_nombre})</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white">{formatCurrency(habitacion.subtotal)}</div>
                              <div className="text-xs text-gray-400">{habitacion.noches} noche(s)</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Observaciones para acción */}
                {reservaSeleccionada.estado === 'pendiente' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Observaciones (opcional para confirmación, obligatorio para rechazo)
                    </label>
                    <textarea
                      value={""}
                      onChange={(e) => {}}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
                      rows={3}
                      placeholder="Agregar comentarios sobre la reserva..."
                    />
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-300 border border-gray-500/30 rounded-xl hover:bg-gray-500/30 transition-all duration-300"
                  >
                    Cerrar
                  </button>
                  
                  {reservaSeleccionada.estado === 'pendiente' && (
                    <>
                      <button
                        onClick={() => handleRechazarReserva(reservaSeleccionada.id)}
                        disabled={accionLoading}
                        className="flex-1 px-4 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <XCircleIcon className="w-5 h-5" />
                        <span>{accionLoading ? 'Rechazando...' : 'Rechazar'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleConfirmarReserva(reservaSeleccionada.id)}
                        disabled={accionLoading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>{accionLoading ? 'Confirmando...' : 'Confirmar'}</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-white">Cargando detalles de la reserva...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 