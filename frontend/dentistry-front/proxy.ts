import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//Список публічних маршрутів для клієнта, які не потребують авторизації
const publicClientRoutes = ["/client/main", "/client/about_us","/client/contacts","/client/doctors"];

/**
 * Перевірка доступу для працівників (адмін, лікар, рецепція).
 * - Перевіряє наявність токена `auth_token`.
 * - Перевіряє відповідність ролі маршруту.
 * - Якщо умови не виконані → редірект на сторінку логіну або 403.
 * @param req NextRequest — запит із cookies та URL
 * @returns NextResponse | null
 */
function checkWorkerAccess(req: NextRequest) {
  const workerToken = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("role")?.value;
  const pathname = req.nextUrl.pathname;

  // Якщо немає токена для працівника → редірект на логін
  if (
    (pathname.startsWith("/admins") ||
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/reception")) &&
    !workerToken
  ) {
    return NextResponse.redirect(new URL("/w-auth/login", req.url));
  }

  // Перевірка ролей для кожного типу маршруту
  if (pathname.startsWith("/admins") && role !== SpecialtyType.ADMIN) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  if (pathname.startsWith("/doctor") && role !== SpecialtyType.DOCTOR) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  if (pathname.startsWith("/reception") && role !== SpecialtyType.RECEPTION) {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return null; // доступ дозволено
}

/**
 * Перевірка доступу для клієнта.
 * - Має список публічних сторінок (`publicClientRoutes`).
 * - Якщо маршрут починається з `/client` і він не публічний → перевіряє cookie `session`.
 * - Якщо сесії немає → редірект на сторінку логіну клієнта.
 * @param req NextRequest — запит із cookies та URL
 * @returns NextResponse | null
 */
function checkClientAccess(req: NextRequest) {
  const clientSession = req.cookies.get("session")?.value;
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/client") &&
    !publicClientRoutes.includes(pathname) && // не публічний маршрут
    !clientSession // немає сесії
  ) {
    return NextResponse.redirect(new URL("/c-auth/login", req.url));
  }

  return null; // доступ дозволено
}

/**
 * Основна функція middleware.
 * - Викликає перевірку працівника (`checkWorkerAccess`).
 * - Якщо вона повернула редірект → завершує виконання.
 * - Інакше викликає перевірку клієнта (`checkClientAccess`).
 * - Якщо вона повернула редірект → завершує виконання.
 * - Якщо обидві перевірки пройдені → пропускає користувача (`NextResponse.next()`).
 * @param req NextRequest — запит із cookies та URL
 * @returns NextResponse
 */
export function proxy(req: NextRequest) {
  // Спочатку перевіряємо працівника
  const workerCheck = checkWorkerAccess(req);
  if (workerCheck) return workerCheck;

  // Потім перевіряємо клієнта
  const clientCheck = checkClientAccess(req);
  if (clientCheck) return clientCheck;

  // Якщо всі перевірки пройдені → доступ дозволено
  return NextResponse.next();
}

/**
 * Конфігурація middleware.
 * - Визначає маршрути, для яких буде застосовуватись перевірка.
 */
export const config = {
  matcher: [
    "/admins/:path*",
    "/doctor/:path*",
    "/reception/:path*",
    "/client/:path*",
  ],
};