# 🚀 Guía de Despliegue - Hotel Paraíso Frontend

## Variables de Entorno de Vercel

### Frontend (hotel-paraiso-frontend.vercel.app)

En Vercel Dashboard > Settings > Environment Variables, agregar:

```bash
NEXTAUTH_URL=https://hotel-paraiso-frontend.vercel.app
NEXTAUTH_SECRET=production-secret-super-seguro-aqui
NEXTAUTH_BACKEND_URL=https://hotel-paraiso-backend.vercel.app
NEXT_PUBLIC_API_URL=https://hotel-paraiso-backend.vercel.app
```

## 📋 Pasos de Despliegue

### 1. Conectar con Vercel
```bash
npm install -g vercel
vercel login
```

### 2. Configurar proyecto
```bash
cd frontendparaiso
vercel
```

### 3. Configurar variables de entorno
En el dashboard de Vercel:
1. Ir a Settings > Environment Variables
2. Agregar todas las variables listadas arriba
3. Marcar para "Production", "Preview" y "Development"

### 4. Desplegar
```bash
vercel --prod
```

## 🔧 Configuraciones Especiales

### NextAuth.js
- URLs actualizadas para producción
- Cookies configuradas para HTTPS
- Redirecciones configuradas correctamente

### API Calls
- Todas las llamadas apuntan al backend en Vercel
- CORS configurado correctamente
- Credentials incluidas en todas las requests

### Imágenes
- Cloudinary configurado como dominio permitido
- Imágenes optimizadas para producción

## ✅ Verificaciones Post-Despliegue

1. **Login/Logout** funciona correctamente
2. **Reservas** se crean sin errores
3. **Dashboard** carga estadísticas
4. **Imágenes** se muestran correctamente
5. **CORS** no bloquea requests 