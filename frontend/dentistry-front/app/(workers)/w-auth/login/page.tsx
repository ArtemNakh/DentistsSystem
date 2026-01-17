"use client";
import { Form, Formik } from "formik";
import { useMemo, useState } from "react";
import loginValidationSchema from "./schemes/login.scheme";
import EmailField from "./components/EmailField";
import PasswordField from "./components/PasswordField";
import SubmitButton from "./components/SubmitButton";
import ResetPasswordLink from "./components/ResetPasswordLink";

export default function WorkerLogin() {
  const loginValidation = useMemo(() => loginValidationSchema, []);

  // const onSubmit = async (values: { email: string; password: string }) => {
  //   // console.log("Submitted values:", values);
  //   // console.log("⏳ Застосунок заснув на 3 секунди...");
  //   // const sleep = (ms: number) =>
  //   //   new Promise((resolve) => setTimeout(resolve, ms));
  //   // await sleep(3000);
  //   // // пауза 3 секунди
  //   // console.log("✅ Submitted values:", values);
  // };
  const [error, setError] = useState<string | null>(null);
  const [worker, setWorker] = useState<any>(null);
  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      setError(null);
      setWorker(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      // ⚠️ Тут вказати реальну адресу бекенду
      const response = await fetch(`${apiUrl}/auth/loginWorker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // бекенд очікує { login, password }
        body: JSON.stringify({
          login: values.email,
          password: values.password,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        setError(errData.message || "Помилка авторизації");
        return;
      }
      const data = await response.json();
      // зберегти токен у localStorage
      localStorage.setItem("access_token", data.access_token);
      // зберегти дані працівника у стан
      setWorker(data.worker);
      console.log("✅ Успішний логін:", data);
    } catch (e: any) {
      setError("Сталася помилка при запиті: " + e.message);
    }
  };

  return (
    <>
      <label className="pb-4 flex justify-center text-2xl ">Login</label>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginValidation}
        onSubmit={onSubmit}
      >
        <Form className="flex flex-col gap-4 ">
          <EmailField />
          <PasswordField />
          <SubmitButton />
          <ResetPasswordLink />
        </Form>
      </Formik>
    </>
  );
}
