import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useState } from "react";
import AppointmentModal from "./ModalView/ModalShowFullAppointment/ModalShowFullAppointment";
import { useTranslation } from "react-i18next";

interface AllDayRecordsProps {
  appointments: IAppointment[];
  selectedDate: Date;
}

export default function AllDayRecords({
  appointments,
  selectedDate,
}: AllDayRecordsProps) {
  const { t } = useTranslation();
  const dayAppointments = appointments.filter(
    (a) =>
      new Date(a.appointment_date).toDateString() ===
      selectedDate.toDateString(),
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);

  return (
    <>
      <div className="w-60 border border-gray-400 bg-linear-to-r from-[#874FD1] to-[#7562A5] flex flex-col h-full">
        <div
          className="flex-1 p-4   overflow-auto scrollbar-thin
                  scrollbar-thumb-[#7D4DBF] scrollbar-track-[#6F6697]"
        >
          <h2 className="text-base font-bold mb-2">
            {t("admins.calendar.records_on")}{" "}
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
            <p>{t("admins.calendar.no_records_day")}</p>
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
