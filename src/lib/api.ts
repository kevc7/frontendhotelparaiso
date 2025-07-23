// Configuración de la API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
  
  // Usuarios
  USUARIOS: {
    LIST: '/usuarios',
    CREATE: '/usuarios',
    GET: (id: string) => `/usuarios/${id}`,
    UPDATE: (id: string) => `/usuarios/${id}`,
    DELETE: (id: string) => `/usuarios/${id}`,
  },
  
  // Habitaciones
  HABITACIONES: {
    LIST: '/habitaciones',
    CREATE: '/habitaciones',
    GET: (id: string) => `/habitaciones/${id}`,
    UPDATE: (id: string) => `/habitaciones/${id}`,
    DELETE: (id: string) => `/habitaciones/${id}`,
  },
  
  // Tipos de Habitación
  TIPOS_HABITACION: {
    LIST: '/tipos-habitacion',
    CREATE: '/tipos-habitacion',
    GET: (id: string) => `/tipos-habitacion/${id}`,
    UPDATE: (id: string) => `/tipos-habitacion/${id}`,
    DELETE: (id: string) => `/tipos-habitacion/${id}`,
  },
  
  // Reservas
  RESERVAS: {
    LIST: '/reservas',
    CREATE: '/reservas',
    GET: (id: string) => `/reservas/${id}`,
    UPDATE: (id: string) => `/reservas/${id}`,
    DELETE: (id: string) => `/reservas/${id}`,
  },
  
  // Comprobantes
  COMPROBANTES: {
    LIST: '/comprobantes',
    CREATE: '/comprobantes',
    GET: (id: string) => `/comprobantes/${id}`,
    UPDATE: (id: string) => `/comprobantes/${id}`,
    DELETE: (id: string) => `/comprobantes/${id}`,
  },
  
  // Facturas
  FACTURAS: {
    LIST: '/facturas',
    CREATE: '/facturas',
    GET: (id: string) => `/facturas/${id}`,
    UPDATE: (id: string) => `/facturas/${id}`,
    DELETE: (id: string) => `/facturas/${id}`,
  },
  
  // Estadísticas
  ESTADISTICAS: {
    GET: '/estadisticas',
  },
  
  // Upload
  UPLOAD: {
    FILE: '/upload',
  },
  
  // Health
  HEALTH: {
    GET: '/health',
  },
};

// Función para hacer peticiones a la API
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Función para subir archivos
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  const url = `${API_BASE_URL}${API_ENDPOINTS.UPLOAD.FILE}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
} 