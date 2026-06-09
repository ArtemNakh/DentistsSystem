import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { format } from "date-fns";
import { useState } from "react";
import ShowPaymentModal from "../ModalView/ShowPaymentModal";
import { useTranslation } from "react-i18next";

interface TableBodyHistoryAppointmentProps {
  appointments: IAppointment[];
  setSelectedAppointment: (appointment: IAppointment | null) => void;
}

export default function TableBodyHistoryAppointment({
  appointments,
  setSelectedAppointment,
}: TableBodyHistoryAppointmentProps) {
  const { t } = useTranslation();

  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

  return (
    <>
      <tbody>
        {!appointments ? (
          <tr>
            <td className="text-gray-900">
              {t("doctor.history_operation.table.loading")}...
            </td>
          </tr>
        ) : appointments.length > 0 ? (
          <>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="bg-gray-100 text-base  text-gray-700 hover:bg-gray-100"
              >
                <td className="border border-gray-400 px-2 py-1">
                  <div className="flex h-full items-center">
                    <div className="mx-1">
                      {appointment.client?.surname} {appointment.client?.name}
                    </div>
                  </div>
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  {appointment.appointment_date
                    ? format(
                        new Date(appointment.appointment_date),
                        "dd.MM.yyyy HH:mm",
                      )
                    : "—"}
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  {appointment.status}
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  {appointment.notes}
                  <button
                    onClick={() => setSelectedAppointment(appointment)}
                    className="  text-gray-500 hover:underline"
                  >
                    +
                  </button>
                </td>

                <td className="relative cursor-pointer border border-gray-400 px-2 py-1">
                  {appointment.payment ? appointment.payment.amount : "—"}
                  <button
                    onClick={() =>
                      setSelectedPayment(
                        selectedPayment?.id === appointment.payment?.id
                          ? null
                          : appointment.payment || null,
                      )
                    }
                    className=" text-gray-500 hover:underline"
                  >
                    +
                  </button>

                  {selectedPayment?.id === appointment.payment?.id && (
                    <ShowPaymentModal
                      payment={selectedPayment}
                      setPayment={setSelectedPayment}
                    />
                  )}
                </td>

             
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td className="text-gray-900">
              {t("doctor.history_operation.table.no_value")}
            </td>
          </tr>
        )}
      </tbody>
    </>
  );
}
