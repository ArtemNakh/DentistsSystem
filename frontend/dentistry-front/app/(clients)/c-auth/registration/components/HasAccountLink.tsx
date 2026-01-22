import Link from "next/link";

export default function HasAccountLink() {
  return (
    <>
      <div className="mt-2 mb-3 text-right pr-5">
        <Link
          href="/c-auth/login"
          className="text-sm text-blue-600 hover:underline"
        >
         Вже маєте аккаунт?
        </Link>
      </div>
    </>
  );
}
