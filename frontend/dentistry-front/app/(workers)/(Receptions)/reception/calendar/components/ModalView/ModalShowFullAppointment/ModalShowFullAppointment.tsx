"use client";

import { useAppDispatch } from "@/lib/redux/hooks";
import { UpdateAppointmentStatus } from "@/lib/redux/modules/Appointments/actions/UpdateAppointmentStatus/UpdateAppointmentStatus";
import {
  IAppointment,
  StatusAppointment,
} from "@/lib/redux/modules/Appointments/Appointment.interface";

import { useTranslation } from "react-i18next";

interface AppointmentModalProps {
  appointment: IAppointment | null;
  onClose: () => void;
}

export default function AppointmentModal({
  appointment,
  onClose,
}: AppointmentModalProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  if (!appointment) return null;

  const handleCancel = () => {
    dispatch(
      UpdateAppointmentStatus({
        appointmentId: appointment.id,
        status: StatusAppointment.CANCELLED,
      }),
    );

    onClose();
  };
  return (
    <div className="text-base absolute top-20 right-80  bg-linear-to-r from-[#874FD1] to-[#7562A5] p-4 rounded shadow-lg w-80 z-50 border border-gray-300">
      <h3 className="text-base font-bold mb-2">
        {t("reception.calendar.full_appointment.detail_appointment")}
      </h3>
      <p className="mb-2">
        <strong>{t("reception.calendar.full_appointment.patient")}:</strong>{" "}
        {appointment.client?.surname} {appointment.client?.name}{" "}
        {appointment.client?.middle_name}
      </p>
      <p className="mb-2">
        <strong>{t("reception.calendar.full_appointment.doctor")}:</strong>{" "}
        {appointment.dentist?.surname} {appointment.dentist?.name}{" "}
        {appointment.dentist?.middle_name}
      </p>
      <p className="mb-2">
        <strong>{t("reception.calendar.full_appointment.date")}:</strong>
        {new Date(appointment.appointment_date).toLocaleString()}
      </p>
      <p className="mb-2">
        <strong>{t("reception.calendar.full_appointment.status")}:</strong>{" "}
        {appointment.status}
      </p>
      <p className="mb-2">
        <strong>{t("reception.calendar.full_appointment.notes")}:</strong>{" "}
        {appointment.notes}
      </p>

      <button
        onClick={() => onClose()}
        className="mt-4 px-4 py-2 bg-[#7D5BB9] text-white rounded hover:bg-[#8657C9] border border-gray-400"
      >
        {t("reception.calendar.full_appointment.close")}
      </button>
      <button
        onClick={handleCancel}
        className="ml-3 px-4 py-2 bg-[#7D5BB9] text-white rounded hover:bg-red-600 border border-gray-400"
      >
        {t("reception.calendar.full_appointment.cancelled")}
      </button>
    </div>
  );
}
