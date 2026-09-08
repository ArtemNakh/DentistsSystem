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

  const appointments = Object.values(
    UseDenormalizeSelector<IAppointment[]>(
      (state: RootState) => state.appointments,
    ),
  )
    .filter((appt) => {
      const today = new Date();
      const apptDate = new Date(appt.appointment_date);

      return apptDate.toDateString() === today.toDateString();
    })
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  return (
    <div className="w-auto h-fit mx-5 my-5 rounded-lg shadow-lg border border-gray-300">
      <h1 className="text-center bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white py-3">
        {t("reception.main.upcomins_entires.nearest_record")}
      </h1>

      <div className="max-h-96 overflow-y-auto border-t border-gray-200">
        <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">
                {t("reception.main.upcomins_entires.table_name.doctor")}
              </th>
              <th className="px-4 py-2 text-left font-semibold">
                {t("reception.main.upcomins_entires.table_name.client")}
              </th>
              <th className="px-4 py-2 text-left font-semibold">
                {t("reception.main.upcomins_entires.table_name.date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-200 py-2">
                  {t("reception.main.upcomins_entires.no_upcoming_entries")}
                </td>
              </tr>
            ) : (
              appointments.map((task, index) => (
                <tr
                  key={index}
                  ref={(el) => {
                    rowRefs.current[index] = el;
                  }}
                  className="odd:bg-gray-50 even:bg-gray-100 hover:bg-purple-200 transition-colors cursor-pointer relative"
                  onClick={() => {
                    selectedTask?.index === index
                      ? setSelectedTask(null)
                      : setSelectedTask({ action: task.notes, index });
                  }}
                >
                  <td className="px-4 py-2 text-gray-800 font-semibold ">
                    {task.dentist?.surname} {task.dentist?.name}{" "}
                    {task.dentist?.middle_name}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {task.client?.surname} {task.client?.name}{" "}
                    {task.client?.middle_name}
                  </td>
                  <td className="px-4 py-2 text-gray-800 relative">
                    {new Date(task.appointment_date).toLocaleString("uk-UA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* модальне вікно — поза таблицею */}
      {selectedTask && (
        <div
          className="absolute left-full w-64 border-2 border-gray-500 bg-gray-100 text-gray-900 rounded-md shadow-lg px-3 py-2 text-base z-50"
          style={{
            top: rowRefs.current[selectedTask.index]?.offsetTop ?? 0, // позиція напроти рядка
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">
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
    </div>
  );
}
