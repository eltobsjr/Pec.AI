import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rotas públicas que não precisam de autenticação
  const isPublicRoute = 
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth/') ||
    pathname.startsWith('/api/');

  // Para rotas públicas, apenas continuar
  if (isPublicRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Verificar usuário autenticado
  const { data: { user } } = await supabase.auth.getUser();

  // Se não está autenticado → redireciona para login
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    // Desabilitar cache no redirect
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set('Cache-Control', 'no-store, must-revalidate');
    return redirectResponse;
  }

  return response;
}
