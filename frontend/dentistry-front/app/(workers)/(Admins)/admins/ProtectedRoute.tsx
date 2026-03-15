"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { SpecialtyType } from "@/lib/redux/modules/Specialties/Specialties.interface";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: SpecialtyType[];
}) {
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (authUser.user) {
      console.log("work");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);
  
  useEffect(() => {
    if (!authUser.user) {
      console.log("user not auth", authUser);
      router.push("/w-auth/login");
    } else if (!allowedRoles.includes(authUser.user.specialty.type)) {
      console.log("auth", authUser);
      router.push("403");
    }
  }, [authUser, router, allowedRoles]);

  return <>{children}</>;
}
