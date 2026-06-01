"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: SpecialtyType[];
}) {
  const authUser: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authUser) {
        await dispatch(getAuthWorker({}));
      }
      setLoading(false);
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!authUser) {
      router.push("/w-auth/login");
      return;
    }

    if (
      authUser &&
      !allowedRoles.includes(authUser.specialty?.type)
    ) {
      router.push("/403");
      return;
    }
  }, [authUser, router, loading, allowedRoles]);

  if (loading) {
    return null; // або залишити лоадер, якщо хочеш
  }

  return <>{children}</>;
}
