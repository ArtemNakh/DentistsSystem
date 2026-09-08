import { useFormikContext } from "formik";
import { ILoginClient } from "../interfaces/LoginClient.interface";
import { useTranslation } from "react-i18next";

export default function SubmitClientLoginButton() {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext<ILoginClient>();
  return (
    <>
      <div className="mx-5 mb-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border w-full border-gray-400 rounded p-2  text-gray-700 hover:bg-gray-300"
        >
          {isSubmitting ? t("loginClient.submit.loading") : t("loginClient.submit.default")}
        </button>
      </div>
    </>
  );
}
