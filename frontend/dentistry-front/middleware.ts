import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
   const token = req.cookies.get("auth_token")?.value; // беремо value
  const role = req.cookies.get("role")?.value;        // беремо value
  console.log("token", token);
  console.log("role", role);
  if (!token) {
    console.log("token",token)
    return NextResponse.redirect(new URL("/w-auth/login", req.url));
  }

  if (role !== "admin") {
    
    console.log("token",role)
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admins/:path*"], // сторінки які треба захищати
};
