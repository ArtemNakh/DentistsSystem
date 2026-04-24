import { useAppSelector } from "@/lib/redux/hooks";
import { PaymentEntity } from "@/lib/redux/modules/Payments/Payments.Entity";
import { StatusPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { RootState } from "@/lib/redux/store";
import { format } from "date-fns";
import { denormalize } from "normalizr";
import { useTranslation } from "react-i18next";

export default function TablePationWithoutPay() {
  const { t } = useTranslation();

  // беремо весь state як entities
  const entities = useAppSelector((state: RootState) => state);

  // отримуємо всі payments денормалізовані
  const payments = Object.keys(entities.payments ?? {})
    .map((id) => denormalize(Number(id), PaymentEntity.schema, entities))
    .filter(Boolean);

  // фільтруємо лише ті, що не оплачені
  const unpaidPayments = payments.filter(
    (payment) => payment.status_paid !== StatusPayment.PAID,
  );

  // console.log("Unpaid payments:", unpaidPayments);

  // const payments = useAppSelector(selectPaymentsWithDetails);

  return (
    <>
      <div className="mt-5 text-base  border-2  border-gray-450">
        <div className="flex items-center justify-center my-2">
          <h2 className="text-base text-center  font-bold ">
            {t("reception.main.patient_without_paid.patient_without_paid_info")}
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
                  {t("reception.main.patient_without_paid.table.patient")}
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  {t("reception.main.patient_without_paid.table.amount")}
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  {t("reception.main.patient_without_paid.table.status")}
                </th>

                <th className="px-4 py-2 text-left font-semibold">
                  {t("reception.main.patient_without_paid.table.date")}
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
