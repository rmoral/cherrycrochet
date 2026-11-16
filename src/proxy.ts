import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, locales } from "@/lib/config";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Back office: refresca la sesión de Supabase
  if (pathname.startsWith("/admin")) {
    const res = NextResponse.next({ request: req });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: (list) =>
            list.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options),
            ),
        },
      });
      await supabase.auth.getUser();
    }
    return res;
  }

  // Tienda: redirige a la versión con idioma (/es, /ca, /en, /fr)
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)))
    return NextResponse.next();

  const accepted = (req.headers.get("accept-language") ?? "")
    .split(",")
    .map((p) => p.split(";")[0].trim().slice(0, 2).toLowerCase());
  const locale =
    accepted.find((l) => (locales as readonly string[]).includes(l)) ??
    defaultLocale;
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
