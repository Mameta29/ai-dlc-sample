import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/", "/signin", "/callback", "/auth/callback", "/api/"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith("/auth/") || pathname === "/signin" || pathname === "/callback";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without auth check
  if (isPublicRoute(pathname)) {
    const { user, response } = await updateSession(request);

    // If authenticated user visits auth pages, redirect to dashboard
    if (isAuthRoute(pathname) && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return response;
  }

  // Protected routes: require authentication
  const { user, supabase, response } = await updateSession(request);

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Check user status for PENDING_DELETION
  const { data: appUser } = await supabase
    .from("users")
    .select("status")
    .eq("id", user.id)
    .single();

  if (appUser?.status === "DELETED") {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
