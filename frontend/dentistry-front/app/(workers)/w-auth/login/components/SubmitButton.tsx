import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function SubmitButton() {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext<{
    login: string;
    password: string;
  }>();
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="border hover:bg-soft-purple-7 border-gray-300 rounded p-2"
    >
      {isSubmitting
        ? t("loginWorker.submit.loading")
        : t("loginWorker.submit.default")}
    </button>
  );
}
