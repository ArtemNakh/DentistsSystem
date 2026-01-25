import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Email",
  description: "Підтвердження електронної пошти користувача",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
