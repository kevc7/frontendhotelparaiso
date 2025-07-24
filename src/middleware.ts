import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname === '/login';
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

    // Si está en página de login y ya está autenticado, redirigir al dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Si no está autenticado y trata de acceder al dashboard, redirigir al login
    if (isDashboardPage && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Verificar que el usuario sea staff/admin para acceder al dashboard
    if (isDashboardPage && isAuth && token?.role !== 'staff' && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acceso a login siempre
        if (req.nextUrl.pathname === '/login') {
          return true;
        }
        
        // Para dashboard, verificar autenticación y rol
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token && (token.role === 'staff' || token.role === 'admin');
        }
        
        return true;
      }
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/login']
}; 