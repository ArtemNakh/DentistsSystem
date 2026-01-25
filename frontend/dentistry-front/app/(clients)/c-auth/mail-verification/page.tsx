"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MailVerificationService } from "./services/mail-verification.services";

export default function MailVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  useEffect(() => {
    const runVerification = async () => {
      const result = await MailVerificationService(token);

      if (result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    };
    runVerification();
  }, [token, router]);

  return (
    <>
      <div>
        <div className="flex items-center justify-center ">
          {status === "loading" && (
            <div className="w-6 h-6 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-green-600 font-semibold">
                ✅ Верифікація успішна, можете зачинити це вікно
              </p>
              <button
                onClick={() => router.push("/c-auth/login")}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Перейти до логіну
              </button>
            </div>
          )}
          {status === "error" && (
            <p className="text-red-600 font-semibold">
              Проїзошла помилка під час підтвердження пошти
            </p>
          )}
        </div>
      </div>
    </>
  );
}
