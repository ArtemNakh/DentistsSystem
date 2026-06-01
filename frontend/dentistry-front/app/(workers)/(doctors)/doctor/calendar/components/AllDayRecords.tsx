import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useState } from "react";
import AppointmentModal from "./ModalView/ModalShowFullAppointment/ModalShowFullAppointment";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface AllDayRecordsProps {
  appointments: IAppointment[];
  selectedDate: Date;
}

export default function AllDayRecords({
  appointments,
  selectedDate,
}: AllDayRecordsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const dayAppointments = appointments.filter(
    (a) =>
      new Date(a.appointment_date).toDateString() ===
      selectedDate.toDateString(),
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);


  const [showNoAppointmentModal, setShowNoAppointmentModal] = useState(false);
  const now = new Date();
  const currentAppointment = dayAppointments.find((a) => {
    const appointmentDate = new Date(a.appointment_date);
    return (
      appointmentDate.getHours() === now.getHours() &&
      appointmentDate.getDate() === now.getDate() &&
      appointmentDate.getMonth() === now.getMonth() &&
      appointmentDate.getFullYear() === now.getFullYear()
    );
  });

  return (
    <>
      <div className="w-60 border border-gray-400 bg-linear-to-r from-[#874FD1] to-[#7562A5] flex flex-col h-full">
        {/*кнопка для поточного запису */}

        <div className="mt-5 -mb-2">
          <button
            onClick={() => {
              if (currentAppointment) {
                router.push(`/doctor/operation/${currentAppointment.id}`);
              } else {
                setShowNoAppointmentModal(true);
              }
            }}
            className="border border-gray-400 m-2 px-2 py-1 hover:bg-[#7D4DBF] active:bg-[#6C43A6]"
          >
            {t("doctor.calendar.current_appointment")}
          </button>

          {/* Якщо немає запису — показуємо модальне вікно */}
          {showNoAppointmentModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-gray-200 p-6 rounded w-96 text-gray-600">
                <h2 className="text-lg font-bold mb-4">
                  {t("doctor.calendar.information")}
                </h2>
                <p>{t("doctor.calendar.no_appointment_time")}</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowNoAppointmentModal(false)}
                    className="px-4 py-2 bg-[#7A5EB2] text-white rounded hover:bg-[#674F96]"
                  >
                    {t("doctor.close")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="flex-1 p-4   overflow-auto scrollbar-thin
                  scrollbar-thumb-[#7D4DBF] scrollbar-track-[#6F6697]"
        >
          <h2 className="text-base font-bold mb-2">
            {t("reception.calendar.records_on")}{" "}
            {selectedDate.toLocaleDateString()}
          </h2>
          {dayAppointments.length > 0 ? (
            <ul className="list-disc pl-5">
              {dayAppointments.map((a) => {
                const time = new Date(a.appointment_date).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );
                return (
                  <li
                    key={a.id}
                    className="border border-gray-400 p-1 my-2"
                    onClick={() => setSelectedAppointment(a)}
                  >
                    {time} – {a.dentist?.surname} {a.dentist?.name}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>{t("reception.calendar.no_records_day")}</p>
          )}
        </div>
        {/* Модальне вікно із усіма данними appointment*/}
        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </div>
    </>
  );
}
