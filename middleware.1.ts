import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { protectedRoutes, studentProtectedRoutes, teacherProtectedRoutes, loginRoutes } from "./middleware";

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
      if (!hasOnboarded && request.nextUrl.pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", originUrl));
      } else {
        // if there is a session, and user is a teacher, dont allow to go to student routes
        if (role === "teacher" && studentProtectedRoutes.includes(request.nextUrl.pathname)) return NextResponse.redirect(new URL("/teacher", originUrl));
        // if there is a session and user is a student, dont allow to go to teacher routes
        if (role === "student" && teacherProtectedRoutes.includes(request.nextUrl.pathname)) return NextResponse.redirect(new URL("/student", originUrl));
      }
      // if there is a session, dont allow them to go to login page.
      if (loginRoutes.includes(request.nextUrl.pathname)) return role === "teacher" ? NextResponse.redirect(new URL("/teacher", originUrl)) : NextResponse.redirect(new URL("/student", originUrl));
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
