import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ResetPasswordLink() {
  const { t } = useTranslation();
  return (
    <Link
      href="/w-auth/reset-password"
      className="w-fit ml-auto text-light-gray-0 hover:text-light-gray-2 justify-start"
    >
      {t("loginWorker.resetPassword")}
    </Link>
  );
}
