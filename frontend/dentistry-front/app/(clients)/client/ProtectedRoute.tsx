// "use client";

// import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
// import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
// import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

// const publicRoutes = ["/client/main", "/client/about_us"];

// export default function ProtectedRoute({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
//   const router = useRouter();
//   const pathname = usePathname();
//   const dispatch = useAppDispatch();
//   const [loading, setLoading] = useState(true);
//   const isPublic = publicRoutes.includes(pathname);
//   const [result, setResult] = useState<any>(undefined);

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (!isPublic) {
//         setLoading(true);
//         try {
//           const res = await dispatch(getAuthClient({}));
//           setResult(res);
//         } catch (err) {
//           console.error("Помилка авторизації:", err);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, [dispatch, isPublic]);

//   // 2. Перевіряємо результат уже з Redux
//   useEffect(() => {
//     console.log("check1", result, isPublic, loading);
//     if (!isPublic && !loading && result === undefined) {
//       console.log("check2",authUser);
//       // перевірка після оновлення Redux
//       if (!authUser?.user) {
//         console.log("check3",authUser);
//         console.warn("Користувач не авторизований — редірект");
//         router.push("/c-auth/login");
//       }
//     }
//   }, [authUser?.user, loading, isPublic, router]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500"></div>
//         <p className="ml-4 text-gray-700">Перевірка авторизації...</p>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }
