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

export default function ClientRegistration() {
  const registrationClientValidation = useMemo(
    () => RegistrationClientValidationSchema,
    [],
  );

  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(async (values: IRegisterClient) => {
    try {
      setError(null);
      const data = await RegistrationClient(values);
      localStorage.setItem("authToken", data.authToken);
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
          Registration
        </label>

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
    </>
  );
}
