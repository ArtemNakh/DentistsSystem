import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function LoginLink() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mt-2 mb-3 text-right pr-5">
        <Link
          href="/c-auth/login"
          className="text-sm text-blue-600 hover:underline"
        >
          {t("loginClient.title")}
        </Link>
      </div>
    </>
  );
}
