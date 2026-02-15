import { useAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";

import { useState } from "react";

export default function TableUpcomingEntries() {
  const [selectedTask, setSelectedTask] = useState<{
    action: string;
    index: number;
  } | null>(null);

  // const appointments: IAppointment[] = Object.values(useAppSelector((state) =>
  //   Object.values(state.appointments ?? {}))
  // );
const appointmentsObj = useAppSelector((state) => state.appointments ?? {});
const appointments: IAppointment[] = Object.values(appointmentsObj);


  return (
    <>
      <div className="w-auto h-fit mx-5 my-5 rounded-lg shadow-lg border border-gray-300">
        <h1 className="text-center text-2xl    bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white py-3">
          Найближчі записи
        </h1>

        {/* показ Списку записів */}
        <ul className="divide-y divide-gray-200">
          {appointments.length === 0 ? (
            <li className="px-3 py-2 text-center text-gray-200">
              На сьогодні немає найближчих операцій{" "}
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
                  <div className="absolute top-0  left-full overflow-visible w-36 ml-2 border-2 border-gray-500 bg-gray-100 text-gray-900 rounded-md shadow-lg px-3 py-2 text-sm ">
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
