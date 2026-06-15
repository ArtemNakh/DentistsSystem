"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import UpdateClientValidationSchema from "./schemes/UpdateClient.scheme";
import { Form, Formik } from "formik";
import { BloodSign, IUpdateClient } from "./interfaces/UpdateClient.interface";
import NameUpdateClientField from "./components/NameUpdateClientField";
import SurnameUpdateClientField from "./components/SurnameUpdateClientField ";
import MiddleNameUpdateClientField from "./components/MiddleNameUpdateClientField copy";
import BirthdayUpdateClientField from "./components/BirthdayUpdateClientField";
import BloodGroupUpdateClientField from "./components/BloodGroupUpdateClientField";
import PhoneUpdateClientField from "./components/PhoneUpdateClientField";
import AllergicDiseasesUpdateClientField from "./components/AllergicDiseasesUpdateClientField";
import EmailUpdateClientField from "./components/EmailUpdateClientField";
import PasswordUpdateClientField from "./components/PasswordUpdateClientField";
import PasswordRepeatUpdateClientField from "./components/PasswordRepeatUpdateClientField";
import SubmitClientUpdateButton from "./components/SubmitUpdateClientButton";

import { useTranslation } from "react-i18next";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import {
  UpdateClient,
  UpdateClientPayload,
} from "@/lib/redux/modules/Clients/actions/UpdateClient.ts/UpdateClient";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";

export default function ClientUpdate() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth)
    .user as IClient;

  const updateClientValidation = useMemo(
    () => UpdateClientValidationSchema,
    [],
  );

  useEffect(() => {
    if (!authUser) {
      dispatch(getAuthClient({}));
    }
  }, [dispatch, authUser]);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: IUpdateClient) => {
      try {
        setError(null);
        if (!authUser) {
          throw new Error("User not loaded");
        }
        // Створюємо об'єкт для збереження змін
        const payload: Partial<UpdateClientPayload> = { id: authUser.id };
        
        (Object.keys(values) as (keyof IUpdateClient)[]).forEach((key) => {
          const newValue = values[key];

          // окремо обробляємо password та passwordRepeat (бо їх немає в IClient)
          if (key === "password" || key === "passwordRepeat") {
            if (newValue && typeof newValue === "string") {
              payload[key] = newValue;
            }
            return;
          }

          // решта ключів порівнюємо з authUser
          if (newValue !== authUser[key as keyof IClient]) {
            payload[key] = newValue as any;
          }
        });
        
        await dispatch(UpdateClient(payload as UpdateClientPayload));
      } catch (e: any) {
        setError(e.message);
        console.log("err", e);
      }
    },
    [dispatch, authUser],
  );

  const initialValues: IUpdateClient = authUser
    ? {
        id: authUser.id, // переконайся, що це number
        name: authUser.name + +authUser.id || "",
        surname: authUser.surname || "",
        middle_name: authUser.middle_name || "",
        birthdate: authUser.birthdate?.slice(0, 10) || "",
        blood_resus: authUser.blood_resus || BloodSign.plus,
        blood_group: authUser.blood_group || 1,
        phone: authUser.phone || "",
        allergic_diseases: authUser.allergic_diseases || "",
        email: authUser.email || "",
        password: "",
        passwordRepeat: "",
      }
    : {
        id: 0,
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
      <div className="bg-gray-100 rounded-2xl">
        <label className="flex text-2xl  text-gray-700 w-full pt-5 mb-3 justify-center">
          {t("client.update-profile.update")}
        </label>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={updateClientValidation}
          onSubmit={onSubmit}
        >
          <Form className="flex flex-col  gap-4 min-h-screen">
            <NameUpdateClientField />
            <SurnameUpdateClientField />
            <MiddleNameUpdateClientField />
            <BirthdayUpdateClientField />
            <BloodGroupUpdateClientField />
            <PhoneUpdateClientField />
            <AllergicDiseasesUpdateClientField />

            <EmailUpdateClientField />
            <PasswordUpdateClientField />
            <PasswordRepeatUpdateClientField />

            <SubmitClientUpdateButton />

            {error && <div className="text-red-500 text-center">{error}</div>}
          </Form>
        </Formik>
      </div>
    </>
  );
}
