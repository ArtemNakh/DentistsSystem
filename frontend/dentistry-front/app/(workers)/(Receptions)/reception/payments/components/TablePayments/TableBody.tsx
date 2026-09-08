import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { useState } from "react";
import FullInfoAppointment from "../ModalViews/FullInfoAppointment";

interface TableBodyPaymentsProps {
  payments: IPayment[];
}

export default function TableBodyPayments({
  payments,
}: TableBodyPaymentsProps) {
  const [fullInfo, setFullInfo] = useState<IAppointment | null>(null);

  return (
    <>
      <tbody>
        {payments.length > 0 ? (
          <>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-300 bg-gray-200 text-gray-700 "
              >
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {p.appointment.client?.surname} {p.appointment.client?.name}{" "}
                  {p.appointment.client?.middle_name}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {p.appointment.dentist?.surname} {p.appointment.dentist?.name}{" "}
                  {p.appointment.dentist?.middle_name}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {p.amount}
                </td>

                <td className="border border-gray-600 px-4 py-2 text-center">
                  {p.status_paid}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {p.method_pay}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {new Date(
                    p.appointment.appointment_date,
                  ).toLocaleDateString()}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {p.appointment.status}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {new Date(p.payment_date).toLocaleDateString()}
                </td>
                <td className="border border-gray-600 px-4 py-2 text-center">
                  <button
                    onClick={() => setFullInfo(p.appointment)}
                    className="  text-gray-500 hover:underline"
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td className="text-gray-900">Немає оплат</td>
          </tr>
        )}
      </tbody>

      <FullInfoAppointment
        appointment={fullInfo}
        setAppointment={setFullInfo}
      />
    </>
  );
}
