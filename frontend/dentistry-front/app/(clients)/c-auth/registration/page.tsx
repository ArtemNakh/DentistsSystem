"use client";

import { useCallback, useMemo, useState } from "react";
import RegistrationClientValidationSchema from "./schemes/RegistrationClient.scheme";
import { RegistrationClient } from "./services/RegistrationClient.services";
import { Form, Formik } from "formik";
import {
  BloodSign,
  IRegisterClient,
} from "./interfaces/RegisterClient.interface";
import HasAccountLink from "./components/HasAccountLink";
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

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "@/app/components/LanguageSwitch";
import { setSessionExpiry } from "@/lib/auth/session";

// динамічний імпорт модального вікна (не вантажиться одразу)
const ModalInfoRegistrationClientField = dynamic(
  () => import("./components/ModalInfoRegistrationClientField"),
  { ssr: false },
);

export default function ClientRegistration() {
  const { t } = useTranslation();
  const registrationClientValidation = useMemo(
    () => RegistrationClientValidationSchema,
    [],
  );

  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = useCallback(async (values: IRegisterClient) => {
    try {
      setError(null);
      const data = await RegistrationClient(values);
      localStorage.setItem("authToken", data.authToken);
      setSessionExpiry();
      // відкриваємо модальне вікно після успішної реєстрації
      setIsModalOpen(true);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const initialValues: IRegisterClient = {
    name: "",
    surname: "",
    middle_name: "",
    birthdate: new Date().toISOString().slice(0, 10),
    blood_resus: BloodSign.plus,
    blood_group: 1,
    phone: "",
    allergic_diseases: "",
    email: "",
    password: "",
    passwordRepeat: "",
  };

  return (
    <>
      <div className="">
        <label className="flex text-2xl  text-gray-700 w-full mt-5 mb-3 justify-center">
          {t("Registraiton")}
        </label>

        <LanguageSwitch
          buttonClassName="mx-5 my-2 rounded p-1 text-gray-700 hover:bg-gray-300 border border-gray-400"
          dropdownClassName="absolute left-1/2 -translate-x-1/2 mt-2  w-auto rounded-md shadow-lg border border-gray-600 bg-gray-300 text-gray-900"
          itemClassName="w-full px-4 py-2 text-sm hover:bg-gray-400"
          activeItemClassName="bg-gray-400 font-bold"
        />
        
        <Formik
          initialValues={initialValues}
          validationSchema={registrationClientValidation}
          onSubmit={onSubmit}
        >
          <Form className="flex flex-col  gap-4 min-h-screen">
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
            <HasAccountLink />
          </Form>
        </Formik>
      </div>
      {/* Модальне вікно підтвердження */}
      <ModalInfoRegistrationClientField
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
