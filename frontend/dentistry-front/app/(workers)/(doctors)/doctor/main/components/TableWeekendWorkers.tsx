"use client";
import { TestuseAppSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { IWorkerWeekend } from "@/lib/redux/modules/ADMINS/Stats/WeekendStats/WeekendStats.interface";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";

export interface IWorkerWeekendWithWorker extends Omit<
  IWorkerWeekend,
  "worker"
> {
  worker: IWorker | null; // після селектора ми підтягуємо повний об’єкт
}

export default function TableWorkersWeekend() {
  const { t } = useTranslation();

  let weekendStats = TestuseAppSelector<IWorkerWeekend[]>(
    (state) => state.workersWeekend,
  );

  const authUser = TestuseAppSelector<AuthState>((state) => state.auth);

  // робимо масив тільки з одним елементом
  weekendStats = weekendStats.filter((s) => s.worker?.id === authUser.user?.id);

  return (
    <div className="mt-8  border-2  border-gray-450 ">
      <h1 className="text-center text-base bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white py-3">
        {t("doctor.main.worker_weekend.title")}
      </h1>

      <div className="max-h-96 border-2 border-gray-400 overflow-y-auto">
        <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
            <tr className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
              <th className="px-4 py-2 w-2/3">
                {" "}
                {t("doctor.main.worker_weekend.table_name.doctor")}{" "}
              </th>
              <th className="px-4 py-2 w-1/3">
                {" "}
                {t("doctor.main.worker_weekend.table_name.un_work_days")}{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {weekendStats.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-gray-500">
                  {t("reception.main.workers_weekend.no_data")}
                </td>
              </tr>
            ) : (
              weekendStats.map((w, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-100 hover:bg-purple-100 transition-colors"
                >
                  <td className="px-4 py-2  text-left text-gray-800">
                    {w.worker?.surname} {w.worker?.name} {w.worker?.middle_name}{" "}
                    ({w.worker?.specialty?.name})
                  </td>
                  <td className="px-4 py-2 text-center text-gray-800">
                    {w.weekendDays}
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
