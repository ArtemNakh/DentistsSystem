import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function AppointmentDateField() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-200">
          {t(
            "reception.calendar.modal.adding_appointment.appointment_date.name",
          )}
        </label>
        <Field
          id="appointment_date"
          name="appointment_date"
          type="date"
          className="w-full p-2 text-gray-200 border border-gray-400 placeholder-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder={t(
            "reception.calendar.modal.adding_appointment.appointment_date.placeholder",
          )}
        />
        <ErrorMessage
          name="appointment_date"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
