import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";

interface FullInfoAppointmentProps {
  appointment: IAppointment | null;
  setAppointment: React.Dispatch<React.SetStateAction<IAppointment | null>>;
}

export default function FullInfoAppointment({
  appointment,
  setAppointment,
}: FullInfoAppointmentProps) {
  const { t } = useTranslation();
  if (!appointment) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30">
      <div className="bg-gray-200 text-base  text-gray-700 rounded-lg shadow-lg p-6 w-11/12 max-w-4xl h-5/6 overflow-auto">
        <h2 className=" font-semibold mb-4">
          {t("reception.payments.full_info_appointment.apponnt_actions")}
        </h2>

        <p>{appointment.notes}</p>

        {appointment.appointment_actions?.map((action, index) => (
          <div
            key={index}
            className="text-gray-600 border border-gray-400 my-1 px-2 py-2"
          >
            <p className=" text-base">
              {t(
                "reception.payments.full_info_appointment.appointment_actions.actions",
              )}
              : {index}
            </p>
            <p>Name: {action.operation.name}</p>
            <p>Description: {action.operation.description}</p>
            <p>Price:{action.operation.price}</p>
          </div>
        ))}

        <button
          onClick={() => setAppointment(null)}
          className="mt-4 px-4 py-2 bg-[#816EB5] text-white rounded hover:bg-[#7463A3]"
        >
          {t("reception.payments.full_info_appointment.close")}
        </button>
      </div>
    </div>,

    document.body,
  );
}
