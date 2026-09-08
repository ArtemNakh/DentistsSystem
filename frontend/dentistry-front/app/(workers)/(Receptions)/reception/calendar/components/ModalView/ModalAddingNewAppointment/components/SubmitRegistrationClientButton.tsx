
import { useTranslation } from "react-i18next";

export default function SubmitAddingAppointment() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mx-5 mb-2 mt-4">
        <button
          type="submit"
          className="border w-full border-gray-400 rounded p-2  text-gray-200 hover:bg-[#774EB5]"
        >
          {t("reception.calendar.modal.adding_appointment.add")}
        </button>
      </div>
    </>
  );
}
