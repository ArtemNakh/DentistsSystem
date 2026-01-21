import Link from "next/link";

export default function NoAccountLink() {
  return (
    <>
      <div className="mt-2 mb-3 text-right pr-5">
        <Link
          href="/c-auth/registration"
          className="text-sm text-blue-600 hover:underline"
        >
          Ще немає аккаунта?
        </Link>
      </div>
    </>
  );
}
