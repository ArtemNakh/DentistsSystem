import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Confirm Email",
  description: "Підтвердження електронної пошти користувача",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <> <Suspense fallback={<div>Loading...</div>}>{children}</Suspense></>;
}
