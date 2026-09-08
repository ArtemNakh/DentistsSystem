import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useTranslation } from "react-i18next";

interface ShowAppointmentActionsProps {
  appointment: IAppointment | null;
  setAppointment: React.Dispatch<React.SetStateAction<IAppointment | null>>;
}

export default function ShowAppointmentActions({
  appointment,
  setAppointment,
}: ShowAppointmentActionsProps) {
  const { t } = useTranslation();
  return (
    <>
      {appointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-linear-to-br from-white to-gray-100 rounded-xl shadow-2xl p-8 w-11/12 max-w-4xl h-5/6 overflow-y-auto animate-fadeIn">
            <h2 className="text-2xl text-[#6f3aaf] font-bold mb-6 border-b pb-2">
              {t(
                "admins.history_operation.appointment_action.appointment_actions",
              )}
            </h2>

            {appointment.appointment_actions &&
            appointment.appointment_actions.length > 0 ? (
              <div className="grid gap-4">
                {appointment.appointment_actions.map((action, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
                  >
                    <p className="text-lg font-semibold text-[#6f3aaf] mb-2">
                      {t("admins.history_operation.appointment_action.action")}{" "}
                      #{index + 1}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        {t("admins.history_operation.appointment_action.name")}:
                      </span>{" "}
                      {action.operation.name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        {t("admins.history_operation.appointment_action.price")}
                        :
                      </span>{" "}
                      <span className="text-green-600 font-bold">
                        {action.operation.price} ₴
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-gray-600 italic text-center">
                {t("admins.history_operation.appointment_action.no_action")}
              </p>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setAppointment(null)}
                className="px-6 py-2 bg-[#6f3aaf] text-white rounded-lg shadow hover:bg-[#7946b7] transition transform hover:scale-105"
              >
                {t("admins.history_operation.appointment_action.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
