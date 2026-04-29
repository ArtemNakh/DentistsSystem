"use client";
import { UseDenormalizeSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import { IWorkerStats } from "@/lib/redux/modules/ADMINS/Stats/WorkerStats/IWorkerStats.interface";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";

export default function TableWorkersStats() {
  const { t } = useTranslation();
const authUser = UseDenormalizeSelector<AuthState>((state) => state.auth);

let stats = UseDenormalizeSelector<IWorkerStats[]>(
  (state) => state.workerStats,
);

// робимо масив тільки з одним елементом
stats = stats.filter((s) => s.worker?.id === authUser.user?.id);

  return (
    <div className="w-auto h-fit mx-5 my-5 rounded-lg shadow-lg  border border-gray-300">
      <h1 className="text-center  bg-linear-to-l from-[#874FD1] to-[#6F6697] text-white py-3">
      {t("doctor.main.records_for_workers.stats_numbers_records_info")}
      </h1>
      <div className="max-h-120 border-2 border-gray-400 overflow-y-auto">
        <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">{t("doctor.main.records_for_workers.table_name.doctor")}</th>
              <th className="px-4 py-2 text-left font-semibold">{t("doctor.main.records_for_workers.table_name.total")}</th>
              <th className="px-4 py-2 text-left font-semibold">{t("doctor.main.records_for_workers.table_name.planned")}</th>
              <th className="px-4 py-2 text-left font-semibold">{t("doctor.main.records_for_workers.table_name.complete")}</th>
              <th className="px-4 py-2 text-left font-semibold">
                {t("doctor.main.records_for_workers.table_name.await_payment")}
              </th>
              <th className="px-4 py-2 text-left font-semibold">{t("doctor.main.records_for_workers.table_name.canceled")}</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, idx) => (
              <tr
                key={idx}
                className="odd:bg-gray-50 even:bg-gray-100 hover:bg-purple-200 transition-colors"
              >
                <td className="px-4 py-2 text-gray-900">
                  {s.worker?.surname} {s.worker?.name}
                </td>
                <td className="px-4 py-2 text-gray-900">{s.stats.total}</td>
                <td className="px-4 py-2 text-gray-900">{s.stats.schedule}</td>
                <td className="px-4 py-2 text-gray-900">{s.stats.completed}</td>
                <td className="px-4 py-2 text-gray-900">{s.stats.waitPaid}</td>
                <td className="px-4 py-2 text-gray-900">{s.stats.cancelled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
