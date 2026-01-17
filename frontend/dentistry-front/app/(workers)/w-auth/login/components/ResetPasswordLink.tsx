import Link from "next/link";

export default function ResetPasswordLink() {
  return (
    <Link
      href="/w-auth/reset-password"
      className="w-fit ml-auto text-light-gray-0 hover:text-light-gray-2 justify-start"
    >
      Reset password
    </Link>
  );
}
