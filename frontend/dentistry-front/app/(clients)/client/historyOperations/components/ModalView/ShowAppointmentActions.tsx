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
  const { t } = useTranslation()
  return (
    <>
      {appointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-4xl h-5/6 overflow-y-auto animate-fadeIn">
            {/* Заголовок */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-amber-700 font-semibold">
             {t("client.history_operation.table.show_appointment_actions.title")}
              </h2>
              <button
                onClick={() => setAppointment(null)}
                className="p-2 rounded-full hover:bg-amber-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Список дій */}
            {appointment.appointment_actions?.length ? (
              <div className="grid gap-4">
                {appointment.appointment_actions.map((action, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-amber-200 bg-amber-50 shadow-sm p-4 hover:shadow-md transition"
                  >
                    <p className="text-lg font-semibold text-amber-700">
                      
             {t("client.history_operation.table.show_appointment_actions.action")} {index + 1}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
             {t("client.history_operation.table.show_appointment_actions.name")}:</span>{" "}
                      {action.operation?.name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
             {t("client.history_operation.table.show_appointment_actions.price")}:</span>{" "}
                      {action.operation?.price} ₴
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-gray-600 italic">
             {t("client.history_operation.table.show_appointment_actions.no_actions")}</p>
            )}

            {/* Кнопка закриття */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setAppointment(null)}
                className="px-5 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition"
              >
                
             {t("client.history_operation.table.show_appointment_actions.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
