"use client";
import { Form, Formik } from "formik";
import { useCallback, useMemo, useState } from "react";
import loginValidationSchema from "./schemes/login.scheme";
import LoginField from "./components/LoginField";
import PasswordField from "./components/PasswordField";
import SubmitButton from "./components/SubmitButton";
import { loginWorker } from "./services/loginService";
import { useTranslation } from "react-i18next";

export default function WorkerLogin() {
  const { t } = useTranslation();
  const loginValidation = useMemo(() => loginValidationSchema, []);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: { login: string; password: string }) => {
      try {
        setError(null);
        const data = await loginWorker(values);
        localStorage.setItem("authToken", data.authToken);
      } catch (e: any) {
        setError(e.message);
      }
    },
    [],
  );

  return (
    <>
      <label className="pb-4 flex justify-center text-2xl ">
        {t("loginWorking.title")}
      </label>

      <Formik
        initialValues={{
          login: "",
          password: "",
        }}
        validationSchema={loginValidation}
        onSubmit={onSubmit}
      >
        <Form className="flex flex-col gap-4 ">
          <LoginField />
          <PasswordField />
          <SubmitButton />
          {error && <div className="text-red-500 text-center">{error}</div>}
        </Form>
      </Formik>
    </>
  );
}
