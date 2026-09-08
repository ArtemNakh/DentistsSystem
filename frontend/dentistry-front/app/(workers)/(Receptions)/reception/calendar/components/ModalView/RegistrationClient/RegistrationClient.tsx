import {  Form, Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";

import { RegisterClientSchema } from "../../Schemes/RegistrationClient.schema";
import { useCallback, useState } from "react";
import {
  AddClient,
  AddClientPayload,
  BloodSign,
} from "@/lib/redux/modules/Clients/actions/AddClient.ts/AddClient";
import { useAppDispatch } from "@/lib/redux/hooks";
import NameRegistrationClientField from "./components/NameRegistrationClientField";
import SurnameRegistrationClientField from "./components/SurnameRegistrationClientField ";
import MiddleNameRegistrationClientField from "./components/MiddleNameRegistrationClientField copy";
import BirthdayRegistrationClientField from "./components/BirthdayRegistrationClientField";
import BloodGroupRegistrationClientField from "./components/BloodGroupRegistrationClientField";
import PhoneRegistrationClientField from "./components/PhoneRegistrationClientField";
import AllergicDiseasesRegistrationClientField from "./components/AllergicDiseasesRegistrationClientField";
import EmailRegistrationClientField from "./components/EmailRegistrationClientField";
import PasswordRegistrationClientField from "./components/PasswordRegistrationClientField";
import PasswordRepeatRegistrationClientField from "./components/PasswordRepeatRegistrationClientField";
import SubmitClientRegistrationButton from "./components/SubmitRegistrationClientButton";

interface ModalAddingNewClientProps {
  onClose: () => void;
}

const initialValues: AddClientPayload = {
  name: "",
  surname: "",
  middle_name: "",
  birthdate: new Date(),
  blood_resus: BloodSign.plus,
  blood_group: 1,
  phone: "",
  allergic_diseases: "",
  email: "",
  password: "",
  passwordRepeat: "",
};

export default function RegistrationClientView({
  onClose,
}: ModalAddingNewClientProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (
      values: AddClientPayload,
      { setSubmitting }: FormikHelpers<AddClientPayload>,
    ) => {
      try {
        await dispatch(AddClient(values));

        onClose();
      } catch (err) {
        setError("Помилка при реєстрації клієнта" + err);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, onClose],
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-30">
        <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] rounded-lg shadow-lg p-6 w-11/12 max-w-4xl h-5/6 overflow-auto">
          <Formik
            initialValues={initialValues}
            validationSchema={RegisterClientSchema}
            onSubmit={onSubmit}
          >
            <Form>
              <NameRegistrationClientField />
              <SurnameRegistrationClientField />
              <MiddleNameRegistrationClientField />
              <BirthdayRegistrationClientField />
              <BloodGroupRegistrationClientField />
              <PhoneRegistrationClientField />
              <AllergicDiseasesRegistrationClientField />

              <EmailRegistrationClientField />
              <PasswordRegistrationClientField />
              <PasswordRepeatRegistrationClientField />

              <SubmitClientRegistrationButton />

              {error && <div className="text-red-500 text-center">{error}</div>}
            </Form>
          </Formik>

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-purple-800 border-2 border-gray-900 text-white rounded hover:bg-purple-700"
          >
            {t("reception.calendar.modal.RegistrationClient.close")}
          </button>
        </div>
      </div>
    </>
  );
}
