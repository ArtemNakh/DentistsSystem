import { RSC_CONTENT_TYPE_HEADER } from "next/dist/client/components/app-router-headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SpecialtyType } from "./lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value; // беремо value
  const role = req.cookies.get("role")?.value; // беремо value
  console.log("token", token);
  console.log("role", role);
  if (!token) {
    console.log("token", token);
    return NextResponse.redirect(new URL("/w-auth/login", req.url));
  }

  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/admins") && role !== SpecialtyType.ADMIN) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  if (pathname.startsWith("/doctor") && role !== SpecialtyType.DOCTOR) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  if (pathname.startsWith("/reception") && role !== SpecialtyType.RECEPTION) {
    return NextResponse.redirect(new URL("/403", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admins/:path*", "/doctor/:path*","/reception/:path*"], // захищаємо обидві групи сторінок
};
