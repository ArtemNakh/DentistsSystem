"use client";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface ModalPaymentProps {
  payment: IPayment | null;
  setPayment: React.Dispatch<React.SetStateAction<IPayment | null>>;
}

export default function ModalPayment({ payment, setPayment }: ModalPaymentProps) {
  const { t } = useTranslation();

  if (!payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-md animate-fadeIn">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-yellow-600">
            {t("client.history_operation.table.payment_modal.title")}
          </h2>
          <button
            onClick={() => setPayment(null)}
            className="p-2 rounded-full hover:bg-amber-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Дані про оплату */}
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-medium text-amber-700">
              {t("client.history_operation.table.payment_modal.amount")}:
            </span>{" "}
            {payment.amount}
          </p>
          <p>
            <span className="font-medium text-amber-700">
              {t("client.history_operation.table.payment_modal.method_pay")}:
            </span>{" "}
            {payment.method_pay}
          </p>
          <p>
            <span className="font-medium text-amber-700">
              {t("client.history_operation.table.payment_modal.payment_day")}:
            </span>{" "}
            {payment.payment_date
              ? format(new Date(payment.payment_date), "dd.MM.yyyy HH:mm")
              : "—"}
          </p>
          <p>
            <span className="font-medium text-amber-700">
              {t("client.history_operation.table.payment_modal.status_pay")}:
            </span>{" "}
            {payment.status_paid}
          </p>
        </div>

        {/* Кнопка закриття */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setPayment(null)}
            className="px-5 py-2 bg-amber-500 text-white rounded-lg shadow hover:bg-amber-600 transition"
          >
            {t("client.history_operation.table.payment_modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
