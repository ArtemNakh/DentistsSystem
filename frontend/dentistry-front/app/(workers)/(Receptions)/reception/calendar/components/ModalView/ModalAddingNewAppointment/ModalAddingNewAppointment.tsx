import { useAppDispatch } from "@/lib/redux/hooks";
import {
  AddNewAppointment,
  AddNewAppointmentPayload,
} from "@/lib/redux/modules/Appointments/actions/AddNewAppointment/AddNewAppointment";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateAppointmentSchema } from "../../Schemes/CreateNewAppointment.schema";
import AppointmentDateField from "./components/AppointmentDateField";
import NotesField from "./components/NotesField";
import ClientField from "./components/ClientField";
import WorkerField from "./components/WorkerField";
import SubmitAddingAppointment from "./components/SubmitRegistrationClientButton";

interface ModalAddingNewAppointmentProps {
  onClose: () => void;
}

const initialValues: AddNewAppointmentPayload = {
  clientId: 0,
  dentistId: 0,
  appointment_date: new Date().toISOString(),
  notes: "",
};

export default function ModalAddingNewAppointment({
  onClose,
}: ModalAddingNewAppointmentProps) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: AddNewAppointmentPayload, { setSubmitting }: any) => {
      try {
        await dispatch(
          AddNewAppointment({
            ...values,
            appointment_date: new Date(values.appointment_date).toISOString(),
          }),
        );

        onClose();
      } catch (err) {
        setError("Помилка при додаванні appointment: " + err);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, onClose],
  );

  return (
    <>
      <div className="fixed inset-0  backdrop-brightness-30 flex items-center justify-center z-50">
        <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5]  p-6 rounded shadow-lg w-2/3 h-2/3 overflow-auto">
          <h2 className="text-base font-bold mb-4">
            {t(
              "reception.calendar.modal.adding_appointment.adding_new_appointment",
            )}
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={CreateAppointmentSchema}
            onSubmit={onSubmit}
          >
            <Form>
              {/* Client full name */}
              <ClientField />

              {/* Worker full name */}
              <WorkerField />
              {/* appointment date */}
              <AppointmentDateField />

              {/* notes */}
              <NotesField />
              <SubmitAddingAppointment />
            </Form>
          </Formik>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 border border-gray-700 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
             {t(
              "reception.calendar.modal.adding_appointment.close",
            )}
          </button>
        </div>
      </div>
    </>
  );
}
