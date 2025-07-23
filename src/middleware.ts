import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // Si está en página de login y ya está autenticado, redirigir al dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Si no está autenticado y trata de acceder al dashboard, redirigir al login
    if (!isAuth && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Verificar que el usuario sea staff para acceder al dashboard
    if (req.nextUrl.pathname.startsWith('/dashboard') && token?.role !== 'staff' && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => true // Permitir todas las rutas, la lógica está arriba
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}; 