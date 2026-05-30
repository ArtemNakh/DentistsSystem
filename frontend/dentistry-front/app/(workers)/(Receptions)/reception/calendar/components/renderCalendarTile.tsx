import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useTranslation } from "react-i18next";

interface RenderCalendarTileProps {
  date: Date;
  view: string;
  appointments: IAppointment[];
}

export default function RenderCalendarTile({
  date,
  view,
  appointments,
}: RenderCalendarTileProps) {
  const { t } = useTranslation();
  if (view !== "month") return null;

  const dayAppointments = appointments.filter(
    (a) => new Date(a.appointment_date).toDateString() === date.toDateString(),
  );

  return (
    <div className="flex flex-col h-full hover:bg-[#7051A6] active:bg-[#6B4D9E]">
      {/* Верхній блок з датою */}
      <div className="w-full flex justify-end items-center border border-gray-400 text-white px-1 text-base">
        {date.getDate()}
      </div>

      {/* Контент для записів */}
      <div className="flex-1 text-base p-1 text-gray-200">
        {dayAppointments.length > 0 ? (
          <>
            {dayAppointments.slice(0, 3).map((a, i) => {
              const time = new Date(a.appointment_date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={i} className="truncate">
                  • {time} - {a.dentist?.surname} {a.dentist?.name}
                </div>
              );
            })}
            {dayAppointments.length > 3 && (
              <div className="text-gray-400 text-sm">
                + {t("reception.calendar.more_record")} 
                {dayAppointments.length - 3}
              </div>
            )}
          </>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
    </div>
  );
}
