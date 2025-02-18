export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const roles = token?.roles;

  const isUserAdmin = roles?.includes("Admin");
  const isUserUser = roles?.includes("User");

  if (!token) {
    // If no token is found, redirect to login
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Define role-based access control
  const adminRoutes = [
    "/admin",
    "/admin/dashboard",
    "/admin/movie",
    "/admin/payments",
    "/admin/schedule",
    "/admin/statistics",
  ];
  const userRoutes = ["/office"];

  if (adminRoutes.includes(req.nextUrl.pathname) && !isUserAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (
    userRoutes.includes(req.nextUrl.pathname) &&
    !isUserUser &&
    !isUserAdmin
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If everything checks out, proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path", "/office"],
};
