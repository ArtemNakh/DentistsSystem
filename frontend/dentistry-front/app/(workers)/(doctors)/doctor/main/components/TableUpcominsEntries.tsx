import { useAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { createSelector } from "@reduxjs/toolkit";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const selectAppointmentsWithDetails = createSelector(
  [
    (state) => state.appointments,
    (state) => state.clients,
    (state) => state.workers,
  ],
  (appointmentsObj, clientsObj, dentistsObj) => {
    const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
    const clients: IClient[] = Object.values(clientsObj ?? {});
    const dentists: IWorker[] = Object.values(dentistsObj ?? {});
    // межі сьогоднішнього дня
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    return appointments // фільтруємо лише ті, що сьогодні
      .filter((appt) => {
        const apptDate = new Date(appt.appointment_date);
        return apptDate >= startOfDay && apptDate <= endOfDay;
      }) // сортуємо від ранку до вечора
      .sort(
        (a, b) =>
          new Date(a.appointment_date).getTime() -
          new Date(b.appointment_date).getTime(),
      )
      .map((appt) => {
        const client = clients.find(
          (c) => c.id === (appt.client as unknown as number),
        );
        const dentist = dentists.find(
          (d) => d.id === (appt.dentist as unknown as number),
        );
        console.log("app", appointments);
        return { ...appt, client: client ?? null, dentist: dentist ?? null };
      });
  },
);

export default function TableUpcomingEntries() {
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<{
    action: string;
    index: number;
  } | null>(null);

  const appointments = useAppSelector(selectAppointmentsWithDetails);

  return (
    <>
      <div className="w-auto h-fit mx-5 my-5 rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-center text-base    bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white py-3">
          {t("reception.main.upcomins_entires.nearest_record")}
        </h1>

        {/* показ Списку записів */}
        <ul className="divide-y divide-gray-200">
          {appointments.length === 0 ? (
            <li className="px-3 py-2 text-center text-gray-200">
              {t("reception.main.upcomins_entires.no_upcoming_entries")}
            </li>
          ) : (
            appointments.map((task, index) => (
              <li
                key={index}
                className="relative grid grid-cols-[250px_1fr_200px] bg-white hover:bg-purple-50 transition-colors cursor-pointer"
                onClick={() =>
                  selectedTask?.index === index
                    ? setSelectedTask(null)
                    : setSelectedTask({ action: task.notes, index })
                }
              >
                <span className="px-3 py-2 font-semibold text-gray-900">
                  {task.dentist?.surname} {task.dentist?.name}{" "}
                  {task.dentist?.middle_name}
                </span>
                <span className="px-3 py-2 text-gray-700">
                  {task.client?.surname} {task.client?.name}{" "}
                  {task.client?.middle_name}
                </span>
                <span className="px-3 py-2 text-gray-700">
                  {new Date(task.appointment_date).toLocaleString("uk-UA", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* маленьке модальне вікно напроти вибраного рядка */}
                {selectedTask && selectedTask.index === index && (
                  <div className="absolute top-0  left-full overflow-visible w-36 ml-2 border-2 border-gray-500 bg-gray-100 text-gray-900 rounded-md shadow-lg px-3 py-2 text-base ">
                    {selectedTask.action}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
