import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isRecipeDetails = pathname.startsWith("/browse-recipes/") && pathname !== "/browse-recipes";

  if (isDashboard || isRecipeDetails) {
    const cookies = request.cookies.getAll();
    const hasSession = cookies.some(cookie => cookie.name.includes("session_token"));
    
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/browse-recipes/:path*"
  ]
};
