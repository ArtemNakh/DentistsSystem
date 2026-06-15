import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import {
  IPayment,
  StatusPayment,
} from "@/lib/redux/modules/Payments/Payments.interface";
import { format } from "date-fns";
import { useState } from "react";
import ShowPaymentModal from "../ModalView/ShowPaymentModal";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/lib/redux/hooks";
import { completePaymentByAppointmentID } from "@/lib/redux/modules/Payments/actions/completePaymentByAppointmentId/completePaymentByAppointmentId";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import ShowClientModal from "../ModalView/ShowClientModal";
import ReactDOM from "react-dom";

interface TableBodyHistoryAppointmentProps {
  appointments: IAppointment[];
  setSelectedAppointment: (appointment: IAppointment | null) => void;
}

export default function TableBodyHistoryAppointment({
  appointments,
  setSelectedAppointment,
}: TableBodyHistoryAppointmentProps) {
  const { t } = useTranslation();
  // {t("reception.history_operation.table.header.client")}
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);

  const dispatch = useAppDispatch();
  return (
    <>
      <tbody>
        {!appointments ? (
          <tr>
            <td className="text-gray-900">Loading...</td>
          </tr>
        ) : appointments.length > 0 ? (
          <>
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="bg-gray-100 text-base  text-gray-700 hover:bg-gray-100"
              >
                <td
                  className="border border-gray-400 px-2 py-1"
                  onClick={() => setSelectedClient(appointment.client || null)}
                >
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
                  {appointment.payment?.status_paid ===
                    StatusPayment.NOT_PAID && (
                    <button
                      onClick={() => {
                        dispatch(
                          completePaymentByAppointmentID({
                            appointmentId: appointment.id,
                          }),
                        );
                      }}
                      className=" group text-gray-900 px-3 py-2 rounded hover:bg-[#795FAE]  transition flex items-center justify-center"
                    >
                      {/* SVG іконка успішної оплати */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#795FAE] group-hover:text-gray-200 transition" // фіолетовий акцент
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </>
        ) : (
          <tr>
            <td className="text-gray-900">
              {t("reception.history_operation.table.body.noValue")}
            </td>
          </tr>
        )}
      </tbody>

      {selectedClient &&
        ReactDOM.createPortal(
          <ShowClientModal
            client={selectedClient}
            setClient={setSelectedClient}
          />,
          document.body,
        )}
    </>
  );
}
