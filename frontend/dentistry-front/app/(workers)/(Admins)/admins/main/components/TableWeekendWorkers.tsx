
"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";


export interface IWorkerWeekend {
  id: number;
  worker: number; // тут зберігається id
  weekendDays: number;
}

export interface IWorkerWeekendWithWorker extends Omit<IWorkerWeekend, "worker"> {
  worker: IWorker | null; // після селектора ми підтягуємо повний об’єкт
}

export const selectWorkerWeekend = createSelector(
  [
    (state: RootState) => state.workersWeekend,
    (state: RootState) => state.workers,
    (state: RootState) => state.specialties,
  ],
  (weekendObj, workersObj, specialtiesObj): IWorkerWeekendWithWorker[] =>
    Object.values(weekendObj ?? {}).map((w: any) => {
      const worker = workersObj[w.worker] ?? null;
      return {
        ...w,
        worker: worker
          ? {
              ...worker,
              specialty: specialtiesObj[worker.specialty] ?? null, // денормалізація
            }
          : null,
      };
    }),
);



export default function TableWorkersWeekend() {
  const { t } = useTranslation();
  const weekendStats = useAppSelector(selectWorkerWeekend);

  return (
    <div className="w-auto h-fit mx-5 my-5 rounded-lg shadow-lg border border-gray-300">
      <h1 className="text-center text-base bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white py-3">
        {t("reception.main.workers_weekend.title")} кількість неробочих днів
      </h1>
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
            <th className="px-4 py-2 w-2/3">Доктор</th>
            <th className="px-4 py-2 w-1/3">Неробочі дні</th>
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
            weekendStats.map((w: IWorkerWeekendWithWorker, idx: number) => (
              <tr
                key={idx}
                className="odd:bg-white even:bg-gray-100 hover:bg-purple-100 transition-colors"
              >
                <td className="px-4 py-2 font-semibold text-left text-gray-800">
                  {w.worker?.surname} {w.worker?.name} {w.worker?.middle_name}{" "}
                  ({w.worker?.specialty?.name})
                </td>
                <td className="px-4 py-2 text-gray-800">{w.weekendDays}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}