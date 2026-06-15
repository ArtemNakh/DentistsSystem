"use client";

import { useCallback, useEffect } from "react";
import { Provider } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import "../i18next.config";

import { store } from "@/lib/redux/store";
import { logoutWorker } from "@/lib/redux/modules/AuthUser/actions/logoutAuthWorker/LogoutAuthWorker";
import { clearSessionExpiry, getSessionExpiry } from "@/lib/auth/session";

const getLoginRedirect = (pathname: string) => {
  if (pathname.startsWith("/c-auth") || pathname.startsWith("/client")) {
    return "/c-auth/login";
  }

  if (
    pathname.startsWith("/w-auth") ||
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/reception") ||
    pathname.startsWith("/admins")
  ) {
    return "/w-auth/login";
  }

  return "/c-auth/login";
};

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const logoutAndRedirect = useCallback(() => {
    console.log("remove")
    store.dispatch(logoutWorker({}));
    clearSessionExpiry();

    localStorage.removeItem("authToken");
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    Cookies.remove("authToken");
    Cookies.remove("auth_token");
    Cookies.remove("role");

    const redirectPath = getLoginRedirect(window.location.pathname);
    router.push(redirectPath);
  }, [router]);

  useEffect(() => {
    const expiry = getSessionExpiry();
    if (!expiry) {
      return;
    }
console.log("expire",expiry)
    const now = Date.now();
    if (expiry <= now) {
      console.log("exit")
      logoutAndRedirect();
      return;
    }

    const timeoutId = window.setTimeout(logoutAndRedirect, expiry - now);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [logoutAndRedirect]);

  return <Provider store={store}>{children}</Provider>;
}
