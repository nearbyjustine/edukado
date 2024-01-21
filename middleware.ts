import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { headers } from "next/headers";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./lib/database.types";

const protectedRoutes = ["/teacher", "/teacher/:path*", "/student", "/student/:path*", "/admin", "/admin/*"];
const teacherProtectedRoutes = ["/teacher", "/teacher/:path*", "/admin", "/admin/*"];
const studentProtectedRoutes = ["/student", "/student/:path*", "/admin", "/admin/*"];
const adminProtectedRoutes = ["/student", "/student/:path*", "/teacher", "/teacher/:path*"];
const loginRoutes = ["/teacher-login", "/student-login", "/", "/admin-login"];

export async function middleware(request: NextRequest) {
  try {
    // The middleware was doing some auth checking and redirecting users who are not logged in,
    // this runs on all requests and was redirecting the loading of assets to
    // a /session-expired page which didn't as an HTML page is not a CSS file.

    // if (request.nextUrl.pathname.startsWith("/_next/")) {
    //   return NextResponse.next();
    // }

    // SSR
    const { supabase, response } = createClient(request);
    // AUTH-HELPERS
    // const supabase = createMiddlewareClient<Database>(req: request, res: );

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    const originUrl = process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL : request.nextUrl.origin;

    // if there is no session, redirect them to landing page
    if (!session && protectedRoutes.includes(request.nextUrl.pathname)) return NextResponse.redirect(new URL("/", originUrl));

    if (session?.user) {
      const role = session.user.user_metadata["role"];
      const hasOnboarded = session.user.user_metadata["hasOnboarded"];

      // if there is a session, check if user has onboarded, otherwise redirect them to onboarding page
      if (hasOnboarded === false) {
        if (role === "student" && request.nextUrl.pathname !== "/onboarding_student") return NextResponse.redirect(new URL("/onboarding_student", originUrl));
        if (role === "teacher" && request.nextUrl.pathname !== "/onboarding") return NextResponse.redirect(new URL("/onboarding", originUrl));
      } else {
        // if there is a session, and user is a teacher, dont allow to go to student routes
        if (role === "teacher" && studentProtectedRoutes.includes(request.nextUrl.pathname)) return NextResponse.redirect(new URL("/teacher", originUrl));
        // if there is a session and user is a student, dont allow to go to teacher routes
        if (role === "student" && teacherProtectedRoutes.includes(request.nextUrl.pathname)) return NextResponse.redirect(new URL("/student", originUrl));
        // if user is admin
        if (!role && adminProtectedRoutes.includes(request.nextUrl.pathname)) return NextResponse.redirect(new URL("/admin", originUrl));
      }
      // if there is a session, dont allow them to go to login page.
      if (loginRoutes.includes(request.nextUrl.pathname)) {
        if (role === "teacher") return NextResponse.redirect(new URL("/teacher", originUrl));
        if (role === "student") return NextResponse.redirect(new URL("/student", originUrl));
        if (!role) return NextResponse.redirect(new URL("/admin", originUrl));
      }
      // if (loginRoutes.includes(request.nextUrl.pathname)) return role === "teacher" ? NextResponse.redirect(new URL("/teacher", originUrl)) : NextResponse.redirect(new URL("/student", originUrl));
    }

    await supabase.auth.getSession();
    return response;
  } catch (e) {
    console.error(e);
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
