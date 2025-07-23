'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UsersIcon, 
  HomeIcon, 
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface StatsData {
  reservas: {
    total_reservas: number;
    reservas_confirmadas: number;
    reservas_pendientes: number;
    reservas_canceladas: number;
    ingresos_estimados: number;
  };
  habitaciones: {
    total_habitaciones: number;
    habitaciones_disponibles: number;
    habitaciones_ocupadas: number;
    habitaciones_mantenimiento: number;
  };
  facturas: {
    total_facturas: number;
    facturas_activas: number;
    facturas_anuladas: number;
    ingresos_facturados: number;
  };
  clientes: {
    clientes_unicos: number;
    total_reservas_clientes: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar estadísticas
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/estadisticas?periodo=mes`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user?.role !== 'staff' && session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchStats();
  }, [session, status, router]);

  // Calcular ingresos del día (estimación)
  const ingresosDia = stats ? Math.round(stats.facturas.ingresos_facturados / 30) : 0;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando dashboard...</p>
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

      {/* Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Dashboard Staff
              </h1>
              <p className="text-gray-300 mt-1">
                Bienvenido, {session.user?.name}
              </p>
            </div>
            <div className="text-sm text-gray-300 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Reservas Pendientes */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Reservas Pendientes</p>
                <p className="text-3xl font-bold text-white">
                  {stats?.reservas.reservas_pendientes || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Habitaciones Disponibles */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Habitaciones Disponibles</p>
                <p className="text-3xl font-bold text-white">
                  {stats?.habitaciones.habitaciones_disponibles || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Usuarios Activos */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Clientes Únicos</p>
                <p className="text-3xl font-bold text-white">
                  {stats?.clientes.clientes_unicos || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Ingresos del Mes */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Ingresos del Mes</p>
                <p className="text-3xl font-bold text-white">
                  ${(stats?.facturas.ingresos_facturados || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Ingresos del Día */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Ingresos Estimados Hoy</p>
                <p className="text-2xl font-bold text-green-400">${ingresosDia.toLocaleString()}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
            </div>
          </div>

          {/* Total Reservas */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Total Reservas</p>
                <p className="text-2xl font-bold text-blue-400">{stats?.reservas.total_reservas || 0}</p>
              </div>
              <CalendarDaysIcon className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          {/* Ocupación */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Tasa de Ocupación</p>
                <p className="text-2xl font-bold text-purple-400">
                  {stats ? Math.round((stats.habitaciones.habitaciones_ocupadas / stats.habitaciones.total_habitaciones) * 100) : 0}%
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gestionar Reservas */}
          <Link href="/dashboard/reservas" className="block group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center mb-4">
                <ClipboardDocumentListIcon className="w-8 h-8 text-green-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white">Gestionar Reservas</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Revisa y confirma las reservas pendientes, gestiona check-ins y check-outs.
              </p>
              <div className="flex items-center text-green-400 font-medium group-hover:text-green-300 transition-colors duration-300">
                Ver reservas →
              </div>
            </div>
          </Link>

          {/* Gestionar Habitaciones */}
          <Link href="/dashboard/habitaciones" className="block group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center mb-4">
                <HomeIcon className="w-8 h-8 text-blue-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white">Gestionar Habitaciones</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Administra el estado de las habitaciones, precios y disponibilidad.
              </p>
              <div className="flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors duration-300">
                Ver habitaciones →
              </div>
            </div>
          </Link>

          {/* Gestionar Usuarios */}
          <Link href="/dashboard/usuarios" className="block group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="flex items-center mb-4">
                <UsersIcon className="w-8 h-8 text-purple-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-white">Gestionar Usuarios</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Administra usuarios del sistema, roles y permisos de acceso.
              </p>
              <div className="flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors duration-300">
                Ver usuarios →
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
            <div className="px-6 py-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Nueva reserva confirmada - Habitación 201</span>
                  <span className="text-xs text-gray-500">hace 5 minutos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Check-out completado - Habitación 105</span>
                  <span className="text-xs text-gray-500">hace 15 minutos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Reserva pendiente requiere confirmación</span>
                  <span className="text-xs text-gray-500">hace 30 minutos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Nuevo usuario registrado</span>
                  <span className="text-xs text-gray-500">hace 1 hora</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 