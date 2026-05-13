// "use client";

// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
// import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
// import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
// import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ProtectedRoute({
//   children,
//   allowedRoles,
// }: {
//   children: React.ReactNode;
//   allowedRoles: SpecialtyType[];
// }) {
//   const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   const fetchUser = async () => {
//   //     if (!authUser.user) {
//   //       await dispatch(getAuthWorker({}));
//   //       setLoading(true);
//   //     } else if (authUser.user) setLoading(false);
//   //   };
//   //   fetchUser();
//   // }, [dispatch]);

//   // useEffect(() => {
//   //   if (loading) return;

//   //   if (!authUser.user && !loading) {
//   //     router.push("/w-auth/login");
//   //     return;
//   //   }

//   //   if (
//   //     authUser.user &&
//   //     !allowedRoles.includes(authUser.user.specialty?.type)
//   //   ) {
//   //     console.log("allowedRoles", allowedRoles.toString());
//   //     console.log("type", authUser.user.specialty.type);
//   //     router.push("/403");
//   //     return;
//   //   }
//   // }, [authUser, router, loading]);

  
//   //   if (!authUser.user && !loading) {
//   //     router.push("/w-auth/login");
//   //     return;
//   //   }
 
//   //  if (
//   //     authUser.user &&
//   //     !allowedRoles.includes(authUser.user.specialty?.type)
//   //   ) {
//   //     console.log("allowedRoles", allowedRoles.toString());
//   //     console.log("type", authUser.user.specialty.type);
//   //     router.push("/403");
//   //     return;
//   //   }
    


//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!authUser.user) {
//         await dispatch(getAuthWorker({}));
//       }
//       setLoading(false);
//     };
//     fetchUser();
//   }, [dispatch]);

//   useEffect(() => {
//     if (loading) return;

//     if (!authUser.user) {
//       router.push("/w-auth/login");
//       return;
//     }

//     if (
//       authUser.user &&
//       !allowedRoles.includes(authUser.user.specialty?.type)
//     ) {
//       router.push("/403");
//       return;
//     }
//   }, [authUser, router, loading, allowedRoles]);

//     if (loading) {
//     return (
//       <div className="w-full h-screen flex items-center justify-center bg-gray-100">
//         <span className="text-lg font-semibold">Loading...</span>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authUser.user) {
        await dispatch(getAuthWorker({}));
      }
      setLoading(false);
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (loading) return;

    if (!authUser.user) {
      router.push("/w-auth/login");
      return;
    }

    if (
      authUser.user &&
      !allowedRoles.includes(authUser.user.specialty?.type)
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
