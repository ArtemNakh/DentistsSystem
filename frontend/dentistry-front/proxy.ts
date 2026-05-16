import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("role")?.value;
  // console.log("token", token);
  // console.log("role", role);
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
  matcher: ["/admins/:path*", "/doctor/:path*", "/reception/:path*"],
};
