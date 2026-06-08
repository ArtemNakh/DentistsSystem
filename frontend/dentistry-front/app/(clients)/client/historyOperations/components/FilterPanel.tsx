import { StatusPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { useTranslation } from "react-i18next";

export interface HistoryFilters {
  fioClient: string;
  fioWorker: string;
  specialty: string;
  statusPaid: StatusPayment | null;
  appointment_date: string;
}

interface FilterPanelProps {
  filters: HistoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<HistoryFilters>>;
}

export default function FilterPanelHistory({
  filters,
  setFilters,
}: FilterPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-8">
      <div className="mx-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* fioWorker */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition">
          <label className="text-yellow-600 font-semibold mb-2 block">
            {t("client.history_operation.filters.fio_worker")}
          </label>
          <input
            value={filters.fioWorker}
            onChange={(e) =>
              setFilters({ ...filters, fioWorker: e.target.value })
            }
            className="h-10 w-full border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700"
          />
        </div>

        {/* specialty */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition">
          <label className="text-yellow-600 font-semibold mb-2 block">
            {t("client.history_operation.filters.specialty")}
          </label>
          <input
            value={filters.specialty}
            onChange={(e) =>
              setFilters({ ...filters, specialty: e.target.value })
            }
            className="h-10 w-full border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700"
          />
        </div>

        {/* statusPaid */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition">
          <label className="text-yellow-600 font-semibold mb-2 block">
            {t("client.history_operation.filters.status_paid")}
          </label>
          <select
            value={filters.statusPaid ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                statusPaid:
                  e.target.value === ""
                    ? null
                    : (e.target.value as StatusPayment),
              })
            }
            className="h-10 w-full border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700"
          >
            <option value="">—</option>
            <option value={StatusPayment.PAID}>
              {t("doctor.history_operation.filters.status_paid.status.paid")}
            </option>
            <option value={StatusPayment.NOT_PAID}>
              {t(
                "doctor.history_operation.filters.status_paid.status.not_paid",
              )}
            </option>
          </select>
        </div>

        {/* appointment_date */}
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 hover:shadow-lg transition">
          <label className="text-yellow-600 font-semibold mb-2 block">
            {t("client.history_operation.filters.appointment_date")}
          </label>
          <input
            type="text"
            placeholder="dd.mm.yyyy"
            value={filters.appointment_date}
            onChange={(e) =>
              setFilters({ ...filters, appointment_date: e.target.value })
            }
            className="h-10 w-full border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-700"
            pattern="\d{2}\.\d{2}\.\d{4}"
          />
        </div>
      </div>
    </div>
  );
}
