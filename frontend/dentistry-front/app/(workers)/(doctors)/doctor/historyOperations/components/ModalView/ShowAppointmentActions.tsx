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
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-4xl h-5/6 overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-bold text-[#7F45B8]">
                {t("doctor.history_operation.actions.name")}
              </h2>
              <button
                onClick={() => setAppointment(null)}
                className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Actions */}
            {appointment.appointment_actions?.length ? (
              <div className="grid gap-4">
                {appointment.appointment_actions.map((action, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[#AD8ED6] bg-gradient-to-r from-[#9370D6] to-white shadow hover:shadow-md transition p-4"
                  >
                    <p className="text-lg font-semibold text-indigo-100 mb-2">
                      Action {index + 1}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        {t("doctor.history_operation.actions.list.name")}:
                      </span>{" "}
                      {action.operation?.name}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-medium">
                        {t("doctor.history_operation.actions.list.price")}:
                      </span>{" "}
                      {action.operation?.price} ₴
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">
                {t("doctor.history_operation.actions.list.no_action")}
              </p>
            )}

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setAppointment(null)}
                className="px-6 py-2 bg-[#7F45B8] text-white rounded-lg shadow hover:bg-indigo-700 transition"
              >
                {t("doctor.history_operation.actions.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
