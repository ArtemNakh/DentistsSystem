import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { HistoryFilters } from "../FilterPanel";
import TableHeaderHistoryAppoinemtn from "./TableHeader";
import TableBodyHistoryAppointment from "./TableBody";
import { format } from "date-fns";
import { useState } from "react";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";

export default function TableHistoryAppointments({
  appointments,
}: {
  appointments: IAppointment[];
}) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);

  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

  return (
    <>
      <table className="w-full   border-collapse border border-gray-600 text-lg">
        <TableHeaderHistoryAppoinemtn />
        <TableBodyHistoryAppointment
          appointments={appointments}
          setSelectedAppointment={setSelectedAppointment}
          setSelectedPayment={setSelectedPayment}
        />
      </table>
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <p>Список усіх дій які були зроблені (ПЕРЕРОБИТИ)</p>
          <div className="bg-white rounded-lg w-125 p-6 relative">
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Деталі операції</h2>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Клієнт:</strong> {selectedAppointment.client?.surname}{" "}
                {selectedAppointment.client?.name}
              </p>

              <p>
                <strong>Лікар:</strong> {selectedAppointment.dentist?.surname}{" "}
                {selectedAppointment.dentist?.name}
              </p>

              <p>
                <strong>Дата:</strong>{" "}
                {selectedAppointment.appointment_date
                  ? format(
                      new Date(selectedAppointment.appointment_date),
                      "dd.MM.yyyy HH:mm",
                    )
                  : "—"}
              </p>

              <p>
                <strong>Статус:</strong> {selectedAppointment.status}
              </p>

              <p>
                <strong>Нотатки:</strong>
              </p>
              <div className="border p-2 rounded bg-gray-100">
                {selectedAppointment.notes || "—"}
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <p>Список усіх дій які були зроблені (ПЕРЕРОБИТИ)</p>
          <div className="bg-white rounded-lg w-125 p-6 relative">
            <button
              onClick={() => setSelectedPayment(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Деталі операції</h2>

            <div className="space-y-2 text-gray-700"></div>
          </div>
        </div>
      )}
    </>
  );
}
