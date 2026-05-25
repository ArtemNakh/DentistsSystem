"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  AddNewAppointment,
  AddNewAppointmentPayload,
} from "@/lib/redux/modules/Appointments/actions/AddNewAppointment/AddNewAppointment";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import AppointmentDateField from "./components/AppointmentDateField";
import NotesField from "./components/NotesField";
import ClientField from "./components/ClientField";
import WorkerField from "./components/WorkerField";
import SubmitAddingAppointment from "./components/SubmitAddingAppointmentButton";

import { CreateAppointmentSchema } from "./schemes/CreateNewAppointment.schema";
import DentistryField from "./components/DentistriesField";

interface AddingNewAppointmentProps {}

const initialValues = {
  clientId: 0,
  dentistId: 0,
  appointment_date: new Date().toISOString(),
  notes: "",
  dentistryId: 0,
};

export default function ModalAddingNewAppointment({}: AddingNewAppointmentProps) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: AddNewAppointmentPayload, { setSubmitting }: any) => {
      try {
        console.log("test",values)
        await dispatch(
          AddNewAppointment({
            ...values,
            appointment_date: new Date(values.appointment_date).toISOString(),
          }),
        );
      } catch (err) {
        setError(t("client.create_appointment.error") + err);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch],
  );

  return (
    <>
      <div className="relative z-10 flex justify-center  py-10 px-6 overflow-auto">
        <div className="w-full max-w-2xl rounded-lg p-6 bg-white shadow border  border-gray-500">
          <h2 className="text-lg text-gray-600 font-bold mb-6">
            {t("client.create_appointment.title")}
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={CreateAppointmentSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <ClientField />
              <DentistryField />
              <WorkerField />
              <AppointmentDateField />
              <NotesField />
              <SubmitAddingAppointment />
            </Form>
          </Formik>

          {error && (
            <div className="mt-4 text-red-600 font-medium">{error}</div>
          )}
        </div>
      </div>
    </>
  );
}
