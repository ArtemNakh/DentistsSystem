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
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-4xl h-5/6 overflow-auto">
            <h2 className="text-xl text-gray-700 font-semibold mb-4">
              {t(
                "admins.history_operation.appointment_action.appointment_actions",
              )}
            </h2>

            {appointment.appointment_actions ? (
              appointment.appointment_actions?.map((action, index) => (
                <div
                  key={index}
                  className="text-gray-600 border border-gray-200 my-1 px-2 py-2"
                >
                  <p className=" text-xl">
                    {t("admins.history_operation.appointment_action.action")} :{" "}
                    {index}
                  </p>
                  <p>
                    {" "}
                    {t(
                      "admins.history_operation.appointment_action.name",
                    )}: {action.operation.name}
                  </p>
                  <p>
                    {" "}
                    {t("admins.history_operation.appointment_action.price")}:
                    {action.operation.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="mb-4 text-gray-800">
                {" "}
                {t("admins.history_operation.appointment_action.no_action")}
              </p>
            )}

            <button
              onClick={() => setAppointment(null)}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              {t("admins.history_operation.appointment_action.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
