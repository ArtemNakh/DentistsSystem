"use client";
import { useAppDispatch, UseDenormalizeSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useEffect } from "react";
import { GetAppointmentById } from "@/lib/redux/modules/Appointments/actions/GetById/GetAppointmentsById";
import { useTranslation } from "react-i18next";
import FormOperation from "./components/FormsOperation";

export default function OperationClient({ id }: { id: string }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const appointmentId = Number(id);
  const appointment = UseDenormalizeSelector<IAppointment[]>(
    (state: RootState) => state.appointments,
  )?.find((a) => a.id === appointmentId);

  useEffect(() => {
    if (!appointment) {
      dispatch(GetAppointmentById({ appointmentId }));
    }
  }, [dispatch, appointmentId, appointment]);

  if (!appointment) {
    return <p>Завантаження...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 rounded shadow-md text-gray-700 text-base">
      {/* Загальна інформація для записи */}
      <h2 className="text-xl font-bold mb-4">
        {t("doctor.operation.appointment_on")}{" "}
        {new Date(appointment.appointment_date).toLocaleString()}
      </h2>
      <p>
        <strong>{t("doctor.operation.doctor")}:</strong>{" "}
        {appointment.dentist?.surname} {appointment.dentist?.name}{" "}
        {appointment.dentist?.middle_name} :{" "}
        {appointment.dentist?.specialty?.name}
      </p>
      <p>
        <strong>{t("doctor.operation.patient")}</strong>{" "}
        {appointment.client?.surname} {appointment.client?.name}{" "}
        {appointment.client?.middle_name} {appointment.client?.birthdate}
      </p>
      <p>
        <strong>{t("doctor.operation.group_blood")}</strong>{" "}
        {appointment.client?.blood_group} {appointment.client?.blood_resus}
      </p>
      <p>
        <strong>{t("doctor.operation.issues")}</strong>{" "}
        {appointment.client?.allergic_diseases}
      </p>

      {/* Форма проведення операції */}
      <FormOperation appointmentId={appointmentId} />
    </div>
  );
}
