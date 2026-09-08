import { UseDenormalizeSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";

import { RootState } from "@/lib/redux/store";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TableUpcomingEntries() {
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<{
    action: string;
    index: number;
  } | null>(null);

  const appointments: IAppointment[] = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ),
  )
    // фільтруємо лише ті, що сьогодні
    .filter((appt) => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      const apptDate = new Date(appt.appointment_date);
      return apptDate >= startOfDay && apptDate <= endOfDay;
    })
    // сортуємо від ранку до вечора
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  return (
    <div className="mt-5 mx-4 text-base border-2 border-gray-450 relative">
      {/* таблиця */}
      {appointments.length === 0 ? (
        <div className="text-center text-gray-400 py-6">
          {t("admins.main.upcomins_entries.table_body.no_values")}
        </div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto border border-gray-400 rounded">
            <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
              <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">
                    {t("admins.main.upcomins_entries.table_head.doctor")}
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">
                    {t("admins.main.upcomins_entries.table_head.client")}
                  </th>
                  <th className="px-4 py-2 text-left font-semibold">
                    {t("admins.main.upcomins_entries.table_head.date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((task, index) => (
                  <tr
                    key={index}
                    ref={(el) => {
                      rowRefs.current[index] = el;
                    }}
                    className="odd:bg-white even:bg-gray-100 hover:bg-purple-100 transition-colors cursor-pointer"
                    onClick={() =>
                      selectedTask?.index === index
                        ? setSelectedTask(null)
                        : setSelectedTask({ action: task.notes, index })
                    }
                  >
                    <td className="px-4 py-2 text-gray-800 font-semibold">
                      {task.dentist?.surname} {task.dentist?.name}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {task.client?.surname} {task.client?.name}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {new Date(task.appointment_date).toLocaleString("uk-UA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* модальне вікно — поза таблицею */}
          {selectedTask && (
            <div
              className="absolute left-full ml-4 w-64 border-2 border-gray-500 bg-gray-100 text-gray-900 rounded-md shadow-lg px-3 py-2 text-base z-50"
              style={{
                top: rowRefs.current[selectedTask.index]?.offsetTop ?? 0, // позиція напроти рядка
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  {" "}
                  {t("admins.main.upcomins_entries.table_head.notes")}
                </span>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✕
                </button>
              </div>
              <p>{selectedTask.action}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
