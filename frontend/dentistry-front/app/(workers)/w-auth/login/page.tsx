"use client";
import { Form, Formik } from "formik";
import { useCallback, useMemo, useState } from "react";
import loginValidationSchema from "./schemes/login.scheme";
import LoginField from "./components/LoginField";
import PasswordField from "./components/PasswordField";
import SubmitButton from "./components/SubmitButton";
import { loginWorker } from "./services/loginService";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "@/app/components/LanguageSwitch";
import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { useRouter } from "next/navigation";

export default function WorkerLogin() {
  const { t } = useTranslation();
  const loginValidation = useMemo(() => loginValidationSchema, []);
  const router = useRouter(); // ← отримуємо екземпляр роутера
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: { login: string; password: string }) => {
      try {
        setError(null);
        const data = await loginWorker(values);
        console.log("auth user ",data)
        localStorage.setItem("authToken", data.authToken);
        // );

        // перевіряємо спеціальність
        switch (data.worker.specialty.type) {
          case SpecialtyType.ADMIN:
            router.push("/admins/main"); // сторінка для адмінів
            break;
          case SpecialtyType.DOCTOR:
            router.push("/doctors/main"); // сторінка для лікарів
            break;
          case SpecialtyType.RECEPTION:
            router.push("/reception/main"); // сторінка для реєстратури
            break;
          default:
            router.push("/403"); // якщо тип невідомий
        }
      } catch (e: any) {
        setError(e.message);
      }
    },
    [],
  );

  return (
    <>
      <label className="pb-4 flex justify-center text-2xl ">
        {t("loginWorker.title")}
      </label>

      <LanguageSwitch
        buttonClassName="-mt-5   mb-3 rounded px-3 py-1 text-white bg-soft-purple-5 hover:bg-amethyst border border-purple-900 transition duration-200"
        dropdownClassName="absolute left-1/2 -translate-x-1/2 mt-2 w-auto rounded-md shadow-lg border border-purple-900 bg-[#7555AD] text-purple-200 z-50"
        itemClassName="w-full px-4 py-2 text-sm hover:bg-slate-blue cursor-pointer"
        activeItemClassName="bg-royal-purple font-bold"
      />

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
