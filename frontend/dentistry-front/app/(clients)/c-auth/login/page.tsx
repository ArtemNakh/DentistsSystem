"use client";
import { Form, Formik } from "formik";
import loginClientValidationSchema from "./schemes/loginClient.scheme";
import { useCallback, useMemo, useState } from "react";
import SubmitClientLoginButton from "./components/SubmitButton";
import EmailClientLoginField from "./components/EmailClientLoginField";
import PasswordClientLoginField from "./components/PasswordClientLoginField";
import NoAccountLink from "./components/NoAccountLink";
import { LoginClient } from "./services/LoginClient.services";
import { ILoginClient } from "./interfaces/LoginClient.interface";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "@/app/components/LanguageSwitch";

export default function ClientLogin() {
  const { t } = useTranslation();
  const loginClientValidation = useMemo(() => loginClientValidationSchema, []);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(async (values: ILoginClient) => {
    try {
      setError(null);
      const data = await LoginClient(values);
      localStorage.setItem("authToken", data.authToken);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  return (
    <>
      <div>
        <label className="flex text-2xl  text-gray-700 w-full mt-5 mb-3 justify-center">
          {t("loginClient.title")}
        </label>
        <LanguageSwitch
          buttonClassName="mx-5 my-2 rounded p-1 text-gray-700 hover:bg-gray-300 border border-gray-400"
          dropdownClassName="absolute mt-2 w-32 rounded-md shadow-lg bg-gray-800 text-white"
          itemClassName="w-full px-3 py-2 text-sm hover:bg-gray-700"
          activeItemClassName="bg-blue-700 font-bold"
        />

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginClientValidation}
          onSubmit={onSubmit}
        >
          <Form className=" ">
            <EmailClientLoginField />
            <PasswordClientLoginField />
            <SubmitClientLoginButton />

            {error && <div className="text-red-500 text-center">{error}</div>}

            <NoAccountLink />
          </Form>
        </Formik>
      </div>
    </>
  );
}
