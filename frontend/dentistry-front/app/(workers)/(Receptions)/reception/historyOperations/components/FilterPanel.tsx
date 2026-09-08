import { MethodPayment, StatusPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { useTranslation } from "react-i18next";

export interface HistoryFilters {
  fioClient: string;
  fioWorker: string;
  specialty: string;
  statusPaid:  StatusPayment | null;
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
        <div className="mx-4 text-base border border-gray-600 flex flex-wrap gap-4 p-2">
          {/* Client */}
          <div className="flex flex-col flex-1 min-w-50">
            <label className="text-gray-200">
              {t("reception.history_operation.filters.fio_client")}
            </label>
            <input
              value={filters.fioClient}
              onChange={(e) =>
                setFilters({ ...filters, fioClient: e.target.value })
              }
              className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
            />
          </div>

          {/* Worker */}
          <div className="flex flex-col flex-1 min-w-50">
            <label className="text-gray-200">
              {t("reception.history_operation.filters.fio_worker")}
            </label>
            <input
              value={filters.fioWorker}
              onChange={(e) =>
                setFilters({ ...filters, fioWorker: e.target.value })
              }
              className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
            />
          </div>

          {/* Specialty */}
          <div className="flex flex-col flex-1 min-w-40">
            <label className="text-gray-200">
              {t("reception.history_operation.filters.specialty")}
            </label>
            <input
              value={filters.specialty}
              onChange={(e) =>
                setFilters({ ...filters, specialty: e.target.value })
              }
              className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
            />
          </div>

          {/* Статус оплати */}
          <div className="flex flex-col flex-1 min-w-40">
            <label className="text-gray-200">
              {t("reception.history_operation.filters.status_paid.name")}
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
              className="h-10 border border-gray-600 bg-[#7660A8] rounded px-2 focus:outline-none w-full"
            >
              <option value="">—</option>
              <option value={StatusPayment.PAID}>
                {t("reception.history_operation.filters.status_paid.status.paid")}
              </option>
              <option value={StatusPayment.NOT_PAID}>
                {t("reception.history_operation.filters.status_paid.status.not_paid")}
              </option>
            </select>
          </div>

          {/* Appointment Date */}
          <div className="flex flex-col flex-1 min-w-35">
            <label className="text-gray-200">
              {t("reception.history_operation.filters.appointment_date")}
            </label>
            <input
              type="text"
              placeholder="dd.mm.yyyy"
              value={filters.appointment_date}
              onChange={(e) =>
                setFilters({ ...filters, appointment_date: e.target.value })
              }
              className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
              pattern="\d{2}\.\d{2}\.\d{4}"
            />
          </div>
        </div>
      </div>
    </>
  );
}
