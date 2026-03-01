

"use client";

import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";

interface AppointmentModalProps {
  appointment: IAppointment | null;
  onClose: () => void;
}

export default function AppointmentModal({
  appointment,
  onClose,
}: AppointmentModalProps) {
  if (!appointment) return null;

  return (
    <div className="text-base absolute top-20 right-80  bg-linear-to-r from-[#874FD1] to-[#7562A5] p-4 rounded shadow-lg w-80 z-50 border border-gray-300">
      <h3 className="text-base font-bold mb-2">Деталі запису</h3>
      <p className="mb-2">
        <strong>Пацієнт:</strong> {appointment.client?.surname} {appointment.client?.name} {appointment.client?.middle_name}
      </p>
      <p className="mb-2">
        <strong>Лікар:</strong> {appointment.dentist?.surname} {appointment.dentist?.name} {appointment.dentist?.middle_name}
      </p>
      <p className="mb-2">
        <strong>Дата:</strong>
        {new Date(appointment.appointment_date).toLocaleString()}
      </p>
      <p className="mb-2">
        <strong>Статус:</strong> {appointment.status}
      </p>
      <p className="mb-2">
        <strong>Нотатки:</strong> {appointment.notes}
      </p>

      <button
        onClick={() => onClose()}
        className="mt-4 px-4 py-2 bg-[#7D5BB9] text-white rounded hover:bg-[#8657C9] border border-gray-400"
      >
        Закрити
      </button>
    </div>
  );
}
