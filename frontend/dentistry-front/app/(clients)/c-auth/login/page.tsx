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
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ClientLogin() {
  const { t } = useTranslation();
  const loginClientValidation = useMemo(() => loginClientValidationSchema, []);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(async (values: ILoginClient) => {
    try {
      setError(null);
      const data = await LoginClient(values);
      localStorage.setItem("authToken", data.authToken);
      Cookies.set("auth_token", data.authToken, { path: "/" });
      router.push("/client/main");
    } catch (e: any) {
      console.log("err")
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
          dropdownClassName="absolute left-1/2 -translate-x-1/2 mt-2  w-auto rounded-md shadow-lg border border-gray-600 bg-gray-300 text-gray-900"
          itemClassName="w-full px-4 py-2 text-sm hover:bg-gray-400"
          activeItemClassName="bg-gray-400 font-bold"
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
