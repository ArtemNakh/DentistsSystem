import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "New password",
  description: "Введення нового паролю",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <> <Suspense fallback={<div>Loading...</div>}>{children}</Suspense></>;
}
