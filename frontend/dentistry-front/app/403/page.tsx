"use client";

import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <h2 className="text-2xl font-semibold mt-4">Доступ заборонений</h2>
      <p className="mt-2 text-gray-600">
        У вас немає прав для перегляду цієї сторінки.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
      >
        Повернутися на головну
      </Link>
    </div>
  );
}
