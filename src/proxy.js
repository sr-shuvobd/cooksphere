import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isRecipeDetails = pathname.startsWith("/browse-recipes/") && pathname !== "/browse-recipes";

  if (isDashboard || isRecipeDetails) {
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;
    if (!sessionToken) {
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
