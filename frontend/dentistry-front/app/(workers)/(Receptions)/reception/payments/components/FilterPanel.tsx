import { StatusAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import {
  MethodPayment,
  StatusPayment,
} from "@/lib/redux/modules/Payments/Payments.interface";
import { useTranslation } from "react-i18next";

export interface PaymentFilters {
  amount: number;
  status_paid: StatusPayment | null;
  method_pay: MethodPayment | null;
  status_appointment: StatusAppointment | null;
  fio_worker: string;
  date_begin: string;
  date_end: string;
}

interface FilterPanelProps {
  filters: PaymentFilters;
  setFilters: React.Dispatch<React.SetStateAction<PaymentFilters>>;
}

export default function FilterPanelPayments({
  filters,
  setFilters,
}: FilterPanelProps) {
  const { t } = useTranslation();
  return (
    <>
     <div className="w-full">
      <div className="mx-4 text-base border border-gray-600 flex flex-wrap gap-4 p-2">
        {/* ФІО */}
        <div className="flex flex-col flex-1 min-w-50">
          <label className="text-gray-200">
            {t("reception.payments.filters.fio_worker")}
          </label>
          <input
            value={filters.fio_worker}
            onChange={(e) =>
              setFilters({ ...filters, fio_worker: e.target.value })
            }
            className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
          />
        </div>

        {/* Сума */}
        <div className="flex flex-col flex-1 min-w-35">
          <label className="text-gray-200">
            {t("reception.payments.filters.amount")}
          </label>
          <input
            type="number"
            value={filters.amount}
            onChange={(e) =>
              setFilters({ ...filters, amount: Number(e.target.value) })
            }
            className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
          />
        </div>

        {/* Статус оплати */}
        <div className="flex flex-col flex-1 min-w-40">
          <label className="text-gray-200">
            {t("reception.payments.filters.status_paid.name")}
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
            className="h-10 border border-gray-600 bg-[#7660A8] rounded px-2 focus:outline-none w-full"
          >
            <option value="">—</option>
            <option value={StatusPayment.PAID}>
              {t("reception.payments.filters.status_paid.status.paid")}
            </option>
            <option value={StatusPayment.NOT_PAID}>
              {t("reception.payments.filters.status_paid.status.not_paid")}
            </option>
          </select>
        </div>

        {/* Метод оплати */}
        <div className="flex flex-col flex-1 min-w-40">
          <label className="text-gray-200">
            {t("reception.payments.filters.method_paid.name")}
          </label>
          <select
            value={filters.method_pay ?? ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                method_pay:
                  e.target.value === ""
                    ? null
                    : (e.target.value as MethodPayment),
              })
            }
            className="h-10 border border-gray-600 bg-[#7660A8] rounded px-2 focus:outline-none w-full"
          >
            <option value="">—</option>
            <option value={MethodPayment.CARD}>
              {t("reception.payments.filters.method_paid.method.cart")}
            </option>
            <option value={MethodPayment.CASH}>
              {t("reception.payments.filters.method_paid.method.cash")}
            </option>
            <option value={MethodPayment.TRANSFER}>
              {t("reception.payments.filters.method_paid.method.transfer")}
            </option>
          </select>
        </div>

        {/* Статус прийому */}
        <div className="flex flex-col flex-1 min-w-45">
          <label className="text-gray-200">
            {t("reception.payments.filters.status_appointment.name")}
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
            className="h-10 border border-gray-600 bg-[#7660A8] rounded px-2 focus:outline-none w-full"
          >
            <option value="">—</option>
            <option value={StatusAppointment.SCHEDULE}>
              {t("reception.payments.filters.status_appointment.status.schedule")}
            </option>
            <option value={StatusAppointment.COMPLETED}>
              {t("reception.payments.filters.status_appointment.status.complete")}
            </option>
            <option value={StatusAppointment.WAIT_PAID}>
              {t("reception.payments.filters.status_appointment.status.wait_paid")}
            </option>
            <option value={StatusAppointment.CANCELLED}>
              {t("reception.payments.filters.status_appointment.status.cancelled")}
            </option>
          </select>
        </div>

        {/* Дата початку */}
        <div className="flex flex-col flex-1 min-w-40">
          <label className="text-gray-200">
            {t("reception.payments.filters.date_begin")}
          </label>
          <input
            type="date"
            value={filters.date_begin}
            onChange={(e) =>
              setFilters({ ...filters, date_begin: e.target.value })
            }
            className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
          />
        </div>

        {/* Дата завершення */}
        <div className="flex flex-col flex-1 min-w-40">
          <label className="text-gray-200">
            {t("reception.payments.filters.date_end")}
          </label>
          <input
            type="date"
            value={filters.date_end}
            onChange={(e) =>
              setFilters({ ...filters, date_end: e.target.value })
            }
            className="h-10 border border-gray-600 rounded px-2 focus:outline-none w-full"
          />
        </div>
      </div>
    </div>
    </>
  );
}
