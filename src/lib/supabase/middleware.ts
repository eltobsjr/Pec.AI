import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
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

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Rotas públicas
  const isPublicRoute = 
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api/');

  // Redirecionar não autenticados para login
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirecionar autenticados que acessam login/signup para home
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}
