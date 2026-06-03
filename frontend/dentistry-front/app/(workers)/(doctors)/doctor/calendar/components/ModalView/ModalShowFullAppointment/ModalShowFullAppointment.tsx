"use client";
import {
  IAppointment,
} from "@/lib/redux/modules/Appointments/Appointment.interface";
import { t } from "i18next";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] p-4 rounded shadow-lg w-[90%] max-w-md border border-gray-300 text-base">
        <h3 className="text-base font-bold mb-2">
          {t("doctor.calendar.appointment.title")}
        </h3>
        <p className="mb-2">
          <strong>{t("doctor.calendar.appointment.patient")}:</strong>{" "}
          {appointment.client?.surname} {appointment.client?.name}{" "}
          {appointment.client?.middle_name}
        </p>
        <p className="mb-2">
          <strong>{t("doctor.calendar.appointment.doctor")}:</strong>{" "}
          {appointment.dentist?.surname} {appointment.dentist?.name}{" "}
          {appointment.dentist?.middle_name}
        </p>
        <p className="mb-2">
          <strong>{t("doctor.calendar.appointment.date")}:</strong>
          {new Date(appointment.appointment_date).toLocaleString()}
        </p>
        <p className="mb-2">
          <strong>{t("doctor.calendar.appointment.status")}:</strong>{" "}
          {appointment.status}
        </p>
        <p className="mb-2">
          <strong>{t("doctor.calendar.appointment.notes")}:</strong>{" "}
          {appointment.notes}
        </p>

        <button
          onClick={() => onClose()}
          className="mt-4 px-4 py-2 bg-[#7D5BB9] text-white rounded hover:bg-[#8657C9] border border-gray-400"
        >
          {t("doctor.calendar.appointment.close")}
        </button>
       
      </div>
    </div>
  );
}
