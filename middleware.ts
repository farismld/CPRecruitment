import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware ini menjaga agar:
 * 1. Semua route di bawah /admin (kecuali /admin/login) WAJIB memiliki
 *    sesi Supabase Auth yang valid. Jika tidak, redirect ke /admin/login.
 * 2. Jika admin yang sudah login mengakses /admin/login, arahkan ke /admin.
 * 3. Session token di-refresh otomatis agar tidak expired saat dipakai.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !session) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
