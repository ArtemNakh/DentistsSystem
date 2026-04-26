import { TestuseAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function TableUpcomingEntries() {
  const { t } = useTranslation();
  const [selectedTask, setSelectedTask] = useState<{
    action: string;
    index: number;
  } | null>(null);

  // денормалізовані appointments напряму через TestuseAppSelector
  const appointments = TestuseAppSelector<IAppointment[]>(
    (state) => state.appointments,
  );

  // межі сьогоднішнього дня
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // фільтруємо лише ті, що сьогодні
  const todayAppointments = appointments
    .filter((appt) => {
      const apptDate = new Date(appt.appointment_date);
      return apptDate >= startOfDay && apptDate <= endOfDay;
    })
    .sort(
      (a, b) =>
        new Date(a.appointment_date).getTime() -
        new Date(b.appointment_date).getTime(),
    );

  return (
    <div className="w-auto h-fit  mx-5 my-5 rounded-lg shadow-lg border border-gray-300">
      <h1 className="text-center  bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white py-3">
        {t("doctor.main.upcomins_entires.nearest_record")}
      </h1>

      <div className="max-h-96  overflow-y-auto border-t border-gray-200">
        <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">
                {t("doctor.main.upcomins_entires.table_name.doctor")}
              </th>
              <th className="px-4 py-2 text-left font-semibold">
                {t("doctor.main.upcomins_entires.table_name.patient")}
              </th>
              <th className="px-4 py-2 text-left font-semibold">
                {t("doctor.main.upcomins_entires.table_name.date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-200 py-2">
                  {t("doctor.main.upcomins_entires.no_upcoming_entries")}
                </td>
              </tr>
            ) : (
              todayAppointments.map((task, index) => (
                <tr
                  key={index}
                  className="odd:bg-gray-50 even:bg-gray-100 hover:bg-purple-200 transition-colors cursor-pointer"
                  onClick={() =>
                    selectedTask?.index === index
                      ? setSelectedTask(null)
                      : setSelectedTask({ action: task.notes, index })
                  }
                >
                  <td className="px-4 py-2 text-gray-900">
                    {task.dentist?.surname} {task.dentist?.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {task.client?.surname} {task.client?.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
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
    </div>
  );
}
