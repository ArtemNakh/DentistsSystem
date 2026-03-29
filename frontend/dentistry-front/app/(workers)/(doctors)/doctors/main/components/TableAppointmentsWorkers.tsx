"use client";
import { useAppSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import { createSelector } from "@reduxjs/toolkit";
export const selectWorkerStats = createSelector(
  [(state) => state.workerStats, (state) => state.workers],
  (statsObj, workersObj) =>
    Object.values(statsObj ?? {}).map((s: any) => ({
      ...s,
      worker: workersObj[s.worker] ?? null,
    })),
);

export default function TableWorkersStats() {
  const { t } = useTranslation();
  const stats = useAppSelector(selectWorkerStats);
  return (
    <div className="w-auto h-fit mx-5 my-5 rounded-lg shadow-lg border border-gray-300">
      <h1 className="text-center text-base bg-linear-to-l from-[#874FD1] to-[#6F6697] text-white py-3">
        Статістика кількості записів (загальна)
      </h1>
      <table className="w-auto border-collapse">
        <thead>
          <tr className="bg-linear-to-r from-[#874FD1] to-[#6F6697]">
            <th className="px-3 py-2">Доктор</th>
            <th className="px-3 py-2">Всього</th>
            <th className="px-3 py-2">Заплановано</th>
            <th className="px-3 py-2">Завершено</th>
            <th className="px-3 py-2">Очікує оплати</th>
            <th className="px-3 py-2">Скасовано</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((s, idx) => (
            <tr key={idx} className="hover:bg-[#61528A]">
              <td className="px-3 py-2 font-semibold">
                {s.worker?.surname} {s.worker?.name}
              </td>
              <td className="px-3 py-2">{s.stats.total}</td>
              <td className="px-3 py-2">{s.stats.schedule}</td>
              <td className="px-3 py-2">{s.stats.completed}</td>
              <td className="px-3 py-2">{s.stats.waitPaid}</td>
              <td className="px-3 py-2">{s.stats.cancelled}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
