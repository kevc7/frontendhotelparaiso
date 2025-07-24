'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UsersIcon, 
  HomeIcon, 
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface DashboardStats {
  reservasPendientes: number;
  reservasConfirmadas: number;
  habitacionesDisponibles: number;
  totalUsuarios: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    reservasPendientes: 0,
    reservasConfirmadas: 0,
    habitacionesDisponibles: 0,
    totalUsuarios: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar estadísticas simplificadas
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Cargar contadores básicos en paralelo
      const [reservasRes, habitacionesRes, usuariosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/reservas`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/habitaciones`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/api/usuarios`, { credentials: 'include' })
      ]);

      let reservasPendientes = 0;
      let reservasConfirmadas = 0;
      let habitacionesDisponibles = 0;
      let totalUsuarios = 0;

      // Procesar reservas
      if (reservasRes.ok) {
        const reservasData = await reservasRes.json();
        const reservas = reservasData.data || [];
        reservasPendientes = reservas.filter((r: any) => r.estado === 'pendiente').length;
        reservasConfirmadas = reservas.filter((r: any) => r.estado === 'confirmada').length;
      }

      // Procesar habitaciones
      if (habitacionesRes.ok) {
        const habitacionesData = await habitacionesRes.json();
        const habitaciones = habitacionesData.data || [];
        habitacionesDisponibles = habitaciones.filter((h: any) => h.estado === 'libre').length;
      }

      // Procesar usuarios
      if (usuariosRes.ok) {
        const usuariosData = await usuariosRes.json();
        totalUsuarios = usuariosData.data?.length || 0;
      }

      setStats({
        reservasPendientes,
        reservasConfirmadas,
        habitacionesDisponibles,
        totalUsuarios
      });

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error al cargar estadísticas del dashboard');
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
                Panel de Gestión
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-200 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Contadores Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Reservas Pendientes */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ExclamationTriangleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Por Confirmar</p>
                <p className="text-4xl font-bold text-white">
                  {stats.reservasPendientes}
                </p>
                <p className="text-xs text-yellow-400 mt-1">reservas pendientes</p>
              </div>
            </div>
          </div>

          {/* Reservas Confirmadas */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Confirmadas</p>
                <p className="text-4xl font-bold text-white">
                  {stats.reservasConfirmadas}
                </p>
                <p className="text-xs text-green-400 mt-1">reservas activas</p>
              </div>
            </div>
          </div>

          {/* Habitaciones Disponibles */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <KeyIcon className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Disponibles</p>
                <p className="text-4xl font-bold text-white">
                  {stats.habitacionesDisponibles}
                </p>
                <p className="text-xs text-blue-400 mt-1">habitaciones libres</p>
              </div>
            </div>
          </div>

          {/* Total Usuarios */}
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Usuarios</p>
                <p className="text-4xl font-bold text-white">
                  {stats.totalUsuarios}
                </p>
                <p className="text-xs text-purple-400 mt-1">en el sistema</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos de Gestión */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gestionar Reservas */}
          <Link href="/dashboard/reservas" className="block group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ClipboardDocumentListIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white ml-4">Gestionar Reservas</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Administra todas las reservas: confirma, cancela y gestiona el estado de las reservas de huéspedes.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-400 font-semibold text-lg group-hover:text-green-300 transition-colors duration-300">
                  Administrar →
                </div>
                <div className="text-sm text-gray-400">
                  {stats.reservasPendientes > 0 && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full">
                      {stats.reservasPendientes} pendientes
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Gestionar Habitaciones */}
          <Link href="/dashboard/habitaciones" className="block group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <HomeIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white ml-4">Gestionar Habitaciones</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Controla el inventario de habitaciones: estados, precios, tipos y disponibilidad.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-400 font-semibold text-lg group-hover:text-blue-300 transition-colors duration-300">
                  Administrar →
                </div>
                <div className="text-sm text-gray-400">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full">
                    {stats.habitacionesDisponibles} libres
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Gestionar Usuarios */}
          <Link href="/dashboard/usuarios" className="block group">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer h-full">
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UsersIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white ml-4">Gestionar Usuarios</h3>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Administra usuarios del sistema: roles, permisos y accesos al panel de control.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-purple-400 font-semibold text-lg group-hover:text-purple-300 transition-colors duration-300">
                  Administrar →
                </div>
                <div className="text-sm text-gray-400">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full">
                    {stats.totalUsuarios} usuarios
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Estado del Sistema */}
        <div className="mt-12 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Estado del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {((stats.reservasConfirmadas / (stats.reservasPendientes + stats.reservasConfirmadas || 1)) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-300">Tasa de Confirmación</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {stats.habitacionesDisponibles}
              </div>
              <div className="text-sm text-gray-300">Habitaciones Listas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {stats.reservasPendientes + stats.reservasConfirmadas}
              </div>
              <div className="text-sm text-gray-300">Reservas Activas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 