"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { GetAppointmentById } from "@/lib/redux/modules/Appointments/actions/GetById/GetAppointmentsById";
import { IOperationList } from "@/lib/redux/modules/OperationList/OperationList.interface";
import { IAppointmentActions } from "@/lib/redux/modules/AppointmentsActions/AppointmentActions.interface";
import { Form, Formik } from "formik";
import AddActionsPage from "./components/AddActionsPage";

export const makeDenormalizeAppointmentById = (appointmentId: number) =>
  createSelector(
    [
      (state: RootState) => state.appointments,
      (state: RootState) => state.clients,
      (state: RootState) => state.workers,
      (state: RootState) => state.specialties,
      (state: RootState) => state.dentistries,
    ],
    (
      appointmentsObj,
      clientsObj,
      workersObj,
      specialtiesObj,
      dentistriesObj,
    ) => {
      const a = appointmentsObj?.[appointmentId];
      if (!a) return undefined;

      const client = clientsObj?.[a.client as unknown as number];
      const dentist = workersObj?.[a.dentist as unknown as number];

      const specialty =
        dentist?.specialty !== undefined
          ? specialtiesObj?.[dentist.specialty as unknown as number]
          : undefined;

      const dentistry =
        dentist?.dentistry !== undefined
          ? dentistriesObj?.[dentist.dentistry as unknown as number]
          : undefined;

      return {
        ...a,
        client,
        dentist: dentist
          ? {
              ...dentist,
              specialty,
              dentistry,
            }
          : undefined,
      } as IAppointment;
    },
  );

export default function OperationClient({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const appointmentId = Number(id);
  const selector = makeDenormalizeAppointmentById(appointmentId);
  const appointment = useAppSelector((state: RootState) => selector(state));

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!appointment) {
      dispatch(GetAppointmentById({ appointmentId }));
    }
  }, [dispatch, appointmentId]);

  if (!appointment) {
    return <p>Завантаження...</p>;
  }
  return (
    <div className="p-6 bg-gray-100 rounded shadow-md text-gray-700  text-base ">
      <h2 className="text-xl font-bold mb-4">
        Запис на {new Date(appointment.appointment_date).toLocaleString()}
      </h2>
      <p>
        <strong>Лікар:</strong> {appointment.dentist?.surname}{" "}
        {appointment.dentist?.name} {appointment.dentist?.middle_name} :{" "}
        {appointment.dentist?.specialty?.name}
      </p>

      <button
        onClick={() => setShowForm(true)}
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Додати операції
      </button>

      {showForm && <AddActionsPage onClose={() => setShowForm(false)} />}
    </div>
  );
}
