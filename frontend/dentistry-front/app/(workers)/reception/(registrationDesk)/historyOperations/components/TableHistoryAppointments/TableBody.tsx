import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { format } from "date-fns";
import { useState } from "react";

export default function TableBodyHistoryAppointment({
  appointments,
  setSelectedAppointment,
  setSelectedPayment,
}: {
  appointments: IAppointment[];
  setSelectedAppointment: (appointment: IAppointment | null) => void;
  setSelectedPayment: (payment: IPayment | null) => void;
}) {
  return (
    <>
      <tbody>
        {appointments.map((text) => (
          <tr
            key={text.id}
            className="bg-gray-100  text-gray-700 hover:bg-gray-100"
          >
            <td className="border border-gray-400 px-2 py-1">
              <div className="flex h-full items-center">
                <div className="mx-1">
                  {text.client?.surname} {text.client?.name}
                </div>
              </div>
            </td>
            <td className="border border-gray-400 px-2 py-1">
              {text.dentist?.surname} {text.dentist?.name}
            </td>
            <td className="border border-gray-400 px-2 py-1">
              {/* {text.appointment_date} */}
              {text.appointment_date
                ? format(new Date(text.appointment_date), "dd.MM.yyyy HH:mm")
                : "—"}
            </td>
            <td className="border border-gray-400 px-2 py-1">{text.status}</td>
            <td className="border border-gray-400 px-2 py-1">
              {text.notes}
              <button
                onClick={() => setSelectedAppointment(text)}
                className=" text-xl text-gray-500 hover:underline"
              >
                +
              </button>
            </td>

            <td className="border border-gray-400 px-2 py-1">
              {text.payment ? text.payment.amount : "—"}
              <button
                onClick={() => setSelectedPayment(text.payment ?? null)}
                className="text-xl text-gray-500 hover:underline"
              >
                +
              </button>
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
      </tbody>
    </>
  );
}
