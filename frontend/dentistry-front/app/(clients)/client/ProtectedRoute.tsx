"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// список публічних маршрутів
const publicRoutes = ["/client/main", "/client/about"];

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const isPublic = publicRoutes.includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isPublic && !authUser?.user) {
        setLoading(true);
        await dispatch(getAuthClient({}));
      }
      setLoading(false);
    };
    checkAuth();
  }, [dispatch, authUser?.user, isPublic]);

  useEffect(() => {
    if (isPublic) {
      setLoading(false);
      return;
    }
    // if (loading) {
    //   if (!authUser?.user) {
    //     router.push("/c-auth/login");
    //   }
    // }
  }, [authUser?.user, router, allowedRoles, isPublic]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
        <p className="ml-4 text-gray-700">Перевірка авторизації...</p>
      </div>
    );
  }

  return <>{children}</>;
}
