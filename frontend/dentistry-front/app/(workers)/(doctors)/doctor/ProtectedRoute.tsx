// "use client";

// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
// import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
// import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
// import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// // export default function ProtectedRoute({
// //   children,
// //   allowedRoles,
// // }: {
// //   children: React.ReactNode;
// //   allowedRoles: SpecialtyType[];
// // }) {
// //   const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
// //   const router = useRouter();
// //   const dispatch = useAppDispatch();
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       if (!authUser.user) {
// //         await dispatch(getAuthWorker({}));
// //       }
// //       setLoading(false);
// //     };
// //     fetchUser();
// //   }, [dispatch]);

// //   useEffect(() => {
// //     if (loading) return; // ще чекаємо дані

// //     if (!authUser.user) {
// //        router.push("/w-auth/login");
// //     }
// //     else if (!allowedRoles.includes(authUser.user.specialty.type)) {
// //       console.log("allowedRoles",allowedRoles.toString())
// //       console.log("type",authUser.user.specialty.type)
// //       router.push("/doctor/403");
// //     }
// //   }, [authUser, router, allowedRoles, loading]);

// //   return <>{children}</>;
// // }

// ;

// export default function ProtectedRoute({
//   children,
//   allowedRoles,
// }: {
//   children: React.ReactNode;
//   allowedRoles: SpecialtyType[];
// }) {
//   const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
//   const router = useRouter();
//   const pathname = usePathname(); // ✅ заміна asPath
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);

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

//     if (!authUser.user && pathname !== "/w-auth/login") {
//       console.log("replace")
//       // router.replace("/w-auth/login");
//     } else if (
//       authUser.user &&
//       !allowedRoles.includes(authUser.user.specialty.type) &&
//       pathname !== "/doctor/403"
//     ) {
//       console.log("replace23")
//       router.replace("/doctor/403");
//     }
//   }, [authUser, router, allowedRoles, loading, pathname]);

//   return <>{children}</>;
// }