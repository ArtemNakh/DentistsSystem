import { useAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import {
  IPayment,
  StatusPayment,
} from "@/lib/redux/modules/Payments/Payments.interface";
import { createSelector } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
const selectPaymentsWithDetails = createSelector(
  [
    (state) => state.payments, // 1. беремо всі платежі
    (state) => state.appointments, // 2. беремо всі записи (прийоми)
    (state) => state.clients, // 3. беремо всіх клієнтів
  ],
  (paymentsObj, appointmentsObj, clientsObj) => {
    // перетворюємо об’єкти у масиви
    const payments: IPayment[] = Object.values(paymentsObj ?? {});
    const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
    const clients: IClient[] = Object.values(clientsObj ?? {});

    // для кожного платежу шукаємо його appointment і клієнта
    return payments // фільтруємо лише ті, що не оплачені
      .filter((payment) => payment.status_paid !== StatusPayment.PAID)
      .map((payment) => {
        // знаходимо appointment, який відповідає цьому платежу
        const appt = appointments.find(
          (a) => a.id === (payment.appointment as unknown as number),
        );

        // якщо appointment знайдено, то шукаємо клієнта цього appointment
        const client = appt
          ? clients.find((c) => c.id === (appt.client as unknown as number))
          : null;

        // повертаємо новий об’єкт платежу з вкладеним appointment і клієнтом
        return {
          ...payment,
          appointment: appt ? { ...appt, client } : null,
        };
      });
  },
);

export default function TablePationWithoutPay() {
  const { t } = useTranslation();
  const payments = useAppSelector(selectPaymentsWithDetails);

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
