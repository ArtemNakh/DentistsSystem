import { useAppDispatch } from "@/lib/redux/hooks";
import { AddNewAppointmentPayload } from "@/lib/redux/modules/Appointments/actions/AddNewAppointment/AddNewAppointment";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateAppointmentSchema } from "../../Schemes/CreateNewAppointment.schema";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import AppointmentDateField from "./components/AppointmentDateField";
import NotesField from "./components/NotesField";
import ClientField from "./components/ClientField";

interface ModalAddingNewAppointmentProps {
  onClose: () => void;
}

const initialValues: AddNewAppointmentPayload = {
  clientId: 0,
  dentistId: 0,
  appointment_date: new Date(),
  notes: "",
};

export default function ModalAddingNewAppointment({
  onClose,
}: ModalAddingNewAppointmentProps) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: any, { setSubmitting }: any) => {
      try {
        console.log("Adding appointment");

        onClose();
      } catch (err) {
        setError("Помилка при додаванні appointment" + err);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, onclose],
  );

  // const { setFieldValue } = useFormikContext<AddNewAppointmentPayload>(); // тепер можна викликати setFieldValue
  // const handleSelectClient = (client: IClient) => {
  //   setFieldValue("clientId", client.id);
  // };

  return (
    <>
      <div className="fixed inset-0  backdrop-brightness-30 flex items-center justify-center z-50">
        <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5]  p-6 rounded shadow-lg w-2/3 h-2/3 overflow-auto">
          <h2 className="text-base font-bold mb-4">Додавання нового запису</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={CreateAppointmentSchema}
            onSubmit={onSubmit}
          >
            <Form>
              {/* Client full name */}
              <ClientField />

              {/* appointment date */}
              <AppointmentDateField />

              {/* notes */}
              <NotesField />
            </Form>
          </Formik>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 border border-gray-700 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Закрити
          </button>
        </div>
      </div>
    </>
  );
}
