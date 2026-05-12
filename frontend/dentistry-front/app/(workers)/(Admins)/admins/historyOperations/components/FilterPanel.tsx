import { useTranslation } from "react-i18next";

export interface HistoryFilters {
  fioClient: string;
  fioWorker: string;
  specialty: string;
  statusPaid: string;
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
    <>
       <div className="w-full">
      <div className="mx-4 text-base border border-gray-600 flex flex-wrap gap-4 p-2 overflow-x-auto">
        <div className="flex flex-col min-w-50">
          <label className="text-gray-200">
            {t("admins.history_operation.filters.fio_client")}
          </label>
          <input
            value={filters.fioClient}
            onChange={(e) =>
              setFilters({ ...filters, fioClient: e.target.value })
            }
            className="h-10 w-full border border-gray-600 rounded px-2 focus:outline-none"
          />
        </div>

        <div className="flex flex-col min-w-50">
          <label className="text-gray-200">
            {t("admins.history_operation.filters.fio_worker")}
          </label>
          <input
            value={filters.fioWorker}
            onChange={(e) =>
              setFilters({ ...filters, fioWorker: e.target.value })
            }
            className="h-10 w-full border border-gray-600 rounded px-2 focus:outline-none"
          />
        </div>

        <div className="flex flex-col min-w-45">
          <label className="text-gray-200">
            {t("admins.history_operation.filters.specialty")}
          </label>
          <input
            value={filters.specialty}
            onChange={(e) =>
              setFilters({ ...filters, specialty: e.target.value })
            }
            className="h-10 w-full border border-gray-600 rounded px-2 focus:outline-none"
          />
        </div>

        <div className="flex flex-col min-w-37,5">
          <label className="text-gray-200">
            {t("admins.history_operation.filters.status_paid")}
          </label>
          <input
            value={filters.statusPaid}
            onChange={(e) =>
              setFilters({ ...filters, statusPaid: e.target.value })
            }
            className="h-10 w-full border border-gray-600 rounded px-2 focus:outline-none"
          />
        </div>

        <div className="flex flex-col min-w-37,5">
          <label className="text-gray-200">
            {t("admins.history_operation.filters.appointment_date")}
          </label>
          <input
            type="text"
            placeholder="dd.mm.yyyy"
            value={filters.appointment_date}
            onChange={(e) =>
              setFilters({ ...filters, appointment_date: e.target.value })
            }
            className="h-10 w-full border border-gray-600 rounded px-2 focus:outline-none"
            pattern="\d{2}\.\d{2}\.\d{4}"
          />
        </div>
      </div>
    </div>
    </>
  );
}
