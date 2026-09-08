"use client";
import { UseDenormalizeSelector } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import { RootState } from "@/lib/redux/store";
import { IWorkerStats } from "@/lib/redux/modules/ADMINS/Stats/WorkerStats/IWorkerStats.interface";
export default function TableWorkersStats() {
  const { t } = useTranslation();
  const stats: IWorkerStats[] = Object.values(
    UseDenormalizeSelector((state: RootState) => state.workerStats),
  );
  return (
    <div className="mt-5 mx-4 text-base  border-2  border-gray-450">
      <div className="flex items-center justify-center my-2">
        <h2 className="text-base text-center  font-bold ">
          {t("admins.main.stats_workers.title")}
        </h2>
      </div>

      <div className="max-h-140 overflow-y-auto border border-gray-400 rounded">
        <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-linear-to-r from-[#6F6697] to-[#874FD1] text-white">
            <tr>
              <th className="px-2 py-2 text-left font-semibold">
                {" "}
                {t("admins.main.stats_workers.table_head.doctor")}
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                {t("admins.main.stats_workers.table_head.all")}
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                {t("admins.main.stats_workers.table_head.planned")}
              </th>

              <th className="px-2 py-2 text-left font-semibold">
                {t("admins.main.stats_workers.table_head.completed")}
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                {t("admins.main.stats_workers.table_head.await_pay")}
              </th>
              <th className="px-2 py-2 text-left font-semibold">
                {t("admins.main.stats_workers.table_head.cancelled")}
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-200">
                  {t("admins.main.stats_workers.no_value")}
                </td>
              </tr>
            ) : (
              stats.map((stat, idx) => (
                <tr
                  key={idx}
                  className="odd:bg-white even:bg-gray-100 hover:bg-purple-100 transition-colors"
                >
                  <td className="px-2 -pr-2 py-2 text-gray-800">
                    {stat.worker?.surname} {stat.worker?.name}
                  </td>
                  <td className="px-2 -pl-2 py-2 text-gray-800">
                    {stat.stats.total}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {stat.stats.schedule}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {stat.stats.completed}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {stat.stats.waitPaid}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {stat.stats.cancelled}
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
