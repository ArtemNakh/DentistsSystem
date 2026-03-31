import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";

export default function SubmitClientRegistrationButton() {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext<{
    
  }>();
  return (
    <>
      <div className="mx-5 mb-2 mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border w-full border-gray-400 rounded p-2  text-gray-200 hover:bg-[#774EB5]"
        >
          {isSubmitting
            ? t("registrationClient.submit.loading")
            : t("registrationClient.submit.default")}
        </button>
      </div>
    </>
  );
}
