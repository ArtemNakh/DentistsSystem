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
                  {appointment.dentist?.surname} {appointment.dentist?.name}
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

                <td className="border border-gray-600 px-2 py-2 text-center">
                  <button className=" text-gray-900 px-3 py-2 rounded hover:bg-[#795FAE] transition flex items-center justify-center">
                    {/* SVG іконка календаря */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
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
