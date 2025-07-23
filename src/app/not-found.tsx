export default function NotFound() {
  return (
    <html>
      <head>
        <title>404 - Página no encontrada | Hotel Paraíso</title>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#059669',
              marginBottom: '1rem'
            }}>404</h1>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Página no encontrada
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem'
            }}>
              Lo sentimos, la página que buscas no existe.
            </p>
            <a 
              href="/"
              style={{
                display: 'inline-block',
                backgroundColor: '#059669',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Volver al inicio
            </a>
          </div>
        </div>
      </body>
    </html>
  );
} 