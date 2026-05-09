import {  UseDenormalizeSelector } from "@/lib/redux/hooks";
import {
  IPayment,
  StatusPayment,
} from "@/lib/redux/modules/Payments/Payments.interface";
import { RootState } from "@/lib/redux/store";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function TablePationWithoutPay() {
  const { t } = useTranslation();
  
  // отримуємо всі платежі з денормалізацією
  const payments: IPayment[] = Object.values(
    UseDenormalizeSelector<IPayment[]>((state: RootState) => state.payments) ??
      {},
  ).filter((payment) => payment.status_paid !== StatusPayment.PAID);

  return (
    <>
      <div className="mt-5 text-base  border-2  border-gray-450">
        <div className="flex items-center justify-center my-2">
          <h2 className="text-base text-center  font-bold ">
            {t("admins.main.patient_without_paid.title")}
          </h2>
        </div>
        {/* Лічильник */}

        {/* Контейнер зі скролом */}
        <div className="max-h-96 overflow-y-auto border border-gray-400 rounded">
          <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-linear-to-r from-[#6F6697] to-[#874FD1] text-white">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">
                  {" "}
                  {t("admins.main.patient_without_paid.table_head.patient")}
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  {t("admins.main.patient_without_paid.table_head.amount")}
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  {t("admins.main.patient_without_paid.table_head.status")}
                </th>

                <th className="px-4 py-2 text-left font-semibold">
                  {t("admins.main.patient_without_paid.no_unpaid_operation")}
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-200">
                    {t(
                      "reception.main.patient_without_paid.today_without_unpaid",
                    )}
                  </td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <tr
                    key={i}
                    className="odd:bg-white even:bg-gray-100 hover:bg-purple-100 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-800">
                      {p.appointment?.client?.name}{" "}
                      {p.appointment?.client?.surname}
                    </td>
                    <td className="px-4 py-2 text-gray-800">{p.amount}</td>
                    <td className="px-4 py-2 text-gray-800">{p.status_paid}</td>
                    <td className="text-gray-800">
                      {p.appointment?.appointment_date
                        ? format(
                            new Date(p.appointment.appointment_date),
                            "dd.MM.yyyy HH:mm",
                          )
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
