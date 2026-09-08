import { StatusAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { StatusPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { useTranslation } from "react-i18next";

export interface HistoryFilters {
  fioClient: string;
  fioWorker: string;
  specialty: string;
  status_paid: StatusPayment | null;
  status_appointment: StatusAppointment | null;
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

          {/* Статус оплати */}
          <div className="flex flex-col">
            <label className="text-gray-200">
              {t("admins.history_operation.filters.status_paid.name")}
            </label>
            <select
              value={filters.status_paid ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status_paid:
                    e.target.value === ""
                      ? null
                      : (e.target.value as StatusPayment),
                })
              }
              className="h-10 border border-gray-600 bg-[#7660A8] rounded px-2 focus:outline-none"
            >
              <option value="">—</option>
              <option value={StatusPayment.PAID}>
                {t("admins.history_operation.filters.status_paid.status.paid")}
              </option>
              <option value={StatusPayment.NOT_PAID}>
                {t(
                  "admins.history_operation.filters.status_paid.status.not_paid",
                )}
              </option>
            </select>
          </div>

          {/* Статус прийому */}
          <div className="flex flex-col">
            <label className="text-gray-200">
              {t("admins.history_operation.filters.status_appointment.name")}
            </label>
            <select
              value={filters.status_appointment ?? ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status_appointment:
                    e.target.value === ""
                      ? null
                      : (e.target.value as StatusAppointment),
                })
              }
              className="h-10 border border-gray-600 bg-[#7660A8]  rounded px-2 focus:outline-none"
            >
              <option value="">—</option>
              <option value={StatusAppointment.SCHEDULE}>
                {t(
                  "admins.history_operation.filters.status_appointment.status.schedule",
                )}
              </option>
              <option value={StatusAppointment.COMPLETED}>
                {t(
                  "admins.history_operation.filters.status_appointment.status.complete",
                )}
              </option>
              <option value={StatusAppointment.WAIT_PAID}>
                {t(
                  "admins.history_operation.filters.status_appointment.status.wait_paid",
                )}
              </option>
              <option value={StatusAppointment.CANCELLED}>
                {t(
                  "admins.history_operation.filters.status_appointment.status.cancelled",
                )}
              </option>
            </select>
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
