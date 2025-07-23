"use client";

import React, { useEffect, useState } from 'react';

interface Habitacion {
  id: number;
  numero: string;
  piso: number;
  estado: string;
  precio_base: number;
  tipo_id: number;
  tipo_nombre: string;
  tipo_descripcion: string;
  capacidad_maxima: number;
  servicios: string | string[];
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface TipoHabitacion {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad_maxima: number;
  precio_base: number;
  servicios: string | string[];
}

const estados = ['libre', 'ocupada', 'separada', 'mantenimiento'];

function HabitacionModal({ open, onClose, onSave, tipos, initial }: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  tipos: TipoHabitacion[];
  initial?: Partial<Habitacion>;
}) {
  const [numero, setNumero] = useState(initial?.numero || '');
  const [piso, setPiso] = useState(initial?.piso?.toString() || '');
  const [tipo, setTipo] = useState(initial?.tipo_id || (tipos[0]?.id ?? ''));
  const [estado, setEstado] = useState(initial?.estado || estados[0]);
  const [observaciones, setObservaciones] = useState(initial?.observaciones || '');
  const [error, setError] = useState('');

  useEffect(() => {
    setNumero(initial?.numero || '');
    setPiso(initial?.piso?.toString() || '');
    setTipo(initial?.tipo_id || (tipos[0]?.id ?? ''));
    setEstado(initial?.estado || estados[0]);
    setObservaciones(initial?.observaciones || '');
    setError('');
  }, [open, initial, tipos]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!numero || !piso) {
      setError('Número y piso son requeridos');
      return;
    }

    const data = {
      numero,
      piso: parseInt(piso),
      tipo_habitacion_id: tipo,
      estado,
      observaciones: observaciones || null
    };

    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initial ? 'Editar Habitación' : 'Nueva Habitación'}
        </h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número *</label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 101"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Piso *</label>
            <input
              type="number"
              value={piso}
              onChange={(e) => setPiso(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 1"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Habitación</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(parseInt(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {tipos.map(t => (
                <option key={t.id} value={t.id}>
                  {t.nombre} - ${Number(t.precio_base).toFixed(2)}/noche
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {estados.map(e => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Observaciones adicionales..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {initial ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HabitacionesDashboard() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState<Habitacion[]>([]);
  const [tipos, setTipos] = useState<TipoHabitacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHabitacion, setEditingHabitacion] = useState<Habitacion | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterPiso, setFilterPiso] = useState('');

  const fetchHabitaciones = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habitaciones`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHabitaciones(data.data || []);
        setHabitacionesFiltradas(data.data || []);
      } else {
        setError('Error al cargar habitaciones');
      }
    } catch (error) {
      setError('Error de conexión al cargar habitaciones');
      console.error('Error:', error);
    }
  };

  const fetchTipos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tipos-habitacion`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTipos(data.data || []);
      }
    } catch (error) {
      console.error('Error al cargar tipos:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchHabitaciones(), fetchTipos()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Efecto para filtrar habitaciones
  useEffect(() => {
    let filtered = [...habitaciones];

    // Filtro por término de búsqueda (número de habitación)
    if (searchTerm) {
      filtered = filtered.filter(h => 
        h.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.tipo_nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filterEstado) {
      filtered = filtered.filter(h => h.estado === filterEstado);
    }

    // Filtro por tipo
    if (filterTipo) {
      filtered = filtered.filter(h => h.tipo_id.toString() === filterTipo);
    }

    // Filtro por piso
    if (filterPiso) {
      filtered = filtered.filter(h => h.piso.toString() === filterPiso);
    }

    setHabitacionesFiltradas(filtered);
  }, [habitaciones, searchTerm, filterEstado, filterTipo, filterPiso]);

  const handleSave = async (data: any) => {
    try {
      const method = editingHabitacion ? 'PUT' : 'POST';
      const url = editingHabitacion 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/habitaciones/${editingHabitacion.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/habitaciones`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        await fetchHabitaciones();
        setShowModal(false);
        setEditingHabitacion(null);
        setError('');
        setSuccess(editingHabitacion ? 'Habitación actualizada exitosamente' : 'Habitación creada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar');
      }
    } catch (error) {
      setError('Error de conexión al guardar');
      console.error('Error:', error);
    }
  };

  const handleEdit = (habitacion: Habitacion) => {
    setEditingHabitacion(habitacion);
    setShowModal(true);
    setError('');
  };

  const handleDelete = async (id: number) => {
    const habitacion = habitaciones.find(h => h.id === id);
    if (!confirm(`¿Estás seguro de eliminar la habitación ${habitacion?.numero}?`)) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/habitaciones/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchHabitaciones();
        setError('');
        setSuccess('Habitación eliminada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al eliminar');
      }
    } catch (error) {
      setError('Error de conexión al eliminar');
      console.error('Error:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterEstado('');
    setFilterTipo('');
    setFilterPiso('');
  };

  // Obtener pisos únicos para el filtro
  const pisosUnicos = [...new Set(habitaciones.map(h => h.piso))].sort((a, b) => a - b);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando habitaciones...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Habitaciones</h1>
        <button
          onClick={() => {
            setEditingHabitacion(null);
            setShowModal(true);
            setError('');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Nueva Habitación
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Número o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {tipos.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
            <select
              value={filterPiso}
              onChange={(e) => setFilterPiso(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {pisosUnicos.map(piso => (
                <option key={piso} value={piso}>
                  Piso {piso}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-600">
          Mostrando {habitacionesFiltradas.length} de {habitaciones.length} habitaciones
        </div>
      </div>

      {/* Tabla de habitaciones */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Piso</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Precio/Noche</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Capacidad</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {habitacionesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  {habitaciones.length === 0 ? 'No hay habitaciones registradas' : 'No se encontraron habitaciones con los filtros aplicados'}
                </td>
              </tr>
            ) : (
              habitacionesFiltradas.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="p-3 border">{h.numero}</td>
                  <td className="p-3 border">{h.piso}</td>
                  <td className="p-3 border">{h.tipo_nombre}</td>
                  <td className="p-3 border">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      h.estado === 'libre' ? 'bg-green-100 text-green-800' :
                      h.estado === 'ocupada' ? 'bg-red-100 text-red-800' :
                      h.estado === 'separada' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {h.estado}
                    </span>
                  </td>
                  <td className="p-3 border">${Number(h.precio_base).toFixed(2)}</td>
                  <td className="p-3 border">{h.capacidad_maxima} personas</td>
                  <td className="p-3 border">
                    {h.observaciones ? (
                      <span className="text-sm text-gray-600">{h.observaciones}</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleEdit(h)}
                      className="mr-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <HabitacionModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingHabitacion(null);
          setError('');
        }}
        onSave={handleSave}
        tipos={tipos}
        initial={editingHabitacion || undefined}
      />
    </div>
  );
} 