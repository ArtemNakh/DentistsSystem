"use client";
import { UseDenormalizeSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import { RootState } from "@/lib/redux/store";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export interface IWorkerWeekend {
  id: number;
  worker: number; // тут зберігається id
  weekendDays: number;
}

export interface IWorkerWeekendWithWorker extends Omit<
  IWorkerWeekend,
  "worker"
> {
  worker: IWorker | null; // після селектора ми підтягуємо повний об’єкт
}

export default function TableWorkersWeekend() {
  const { t } = useTranslation();
  // отримуємо всі вихідні дні лікарів з денормалізацією
  const weekendStats: IWorkerWeekendWithWorker[] = Object.values(
    UseDenormalizeSelector<IWorkerWeekendWithWorker[]>(
      (state: RootState) => state.workersWeekend,
    ) ?? {},
  );

  return (
    <div className="w-full h-fit  my-4 rounded-lg shadow-lg border border-gray-300 overflow-x-auto">
   <div className="flex items-center justify-center my-2">
          <h2 className="text-base text-center  font-bold ">
              {t("admins.main.weekend_workers.title")}
        </h2>
      </div>
      <table className="min-w-full border-collapse text-center text-xs sm:text-sm md:text-base">
        <thead>
          <tr className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
            <th className="px-2 sm:px-4 py-2 w-2/3">
              {t("admins.main.weekend_workers.table_head.worker")}
            </th>
            <th className="px-2 sm:px-4 py-2 w-1/3">
              {t("admins.main.weekend_workers.table_head.amount_unworking_day")}
            </th>
          </tr>
        </thead>
        <tbody>
          {weekendStats.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-4 py-2 text-gray-500">
                {t("admins.main.weekend_workers.no_value")}
              </td>
            </tr>
          ) : (
            weekendStats.map((w, idx) => (
              <tr
                key={idx}
                className="odd:bg-white even:bg-gray-100 hover:bg-purple-100 transition-colors"
              >
                <td className="px-2 sm:px-4 py-2 font-semibold text-left text-gray-800 whitespace-nowrap">
                  {w.worker?.surname} {w.worker?.name} {w.worker?.middle_name} (
                  {w.worker?.specialty?.name})
                </td>
                <td className="px-2 sm:px-4 py-2 text-gray-800">
                  {w.weekendDays}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
