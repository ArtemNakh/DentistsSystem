import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useCallback } from "react";
import SpecialtyField from "./components/SpecialtyField";
import { Field, Form, Formik } from "formik";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import {
  CreateWorker,
  CreateWorkerPayload,
} from "@/lib/redux/modules/Workers/actions/CreateWorker/CreateWorker";
import { CreateWorkerSchema } from "./schema/CreateWorkerSchema";
import { useTranslation } from "react-i18next";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export default function CreateWorkerModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const authUser:IWorker = useAppSelector((state: { auth: AuthState }) => state.auth.user) as IWorker;
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    async (values: CreateWorkerPayload, { setSubmitting }: any) => {
      try {
        await dispatch(
          CreateWorker({
            ...values,
            birthday: values.birthday, // вже "2026-01-07"
          }),
        );

        onClose();
      } catch (err) {
        console.log("Error during adding new worker: " + err);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, onClose],
  );

  return (
    <Formik
      initialValues={{
        name: "",
        surname: "",
        middle_name: "",
        birthday: "",
        phone: "",
        specialtyId: 0,
        dentistryId: authUser?.dentistry?.id ?? 0,
        login: "",
        password: "",
      }}
      validationSchema={CreateWorkerSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-200 p-6 rounded w-96 text-gray-600">
              <h2 className="text-lg font-bold mb-4">
                {t("admins.workers.create_worker.title")}
              </h2>

              <Field
                name="name"
                placeholder={t(
                  "admins.workers.create_worker.placeholders.name",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}

              <Field
                name="surname"
                placeholder={t(
                  "admins.workers.create_worker.placeholders.surname",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.surname && touched.surname && (
                <div className="text-red-500 text-sm">{errors.surname}</div>
              )}

              <Field
                name="middle_name"
                placeholder={t(
                  "admins.workers.create_worker.placeholders.middle_name",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.middle_name && touched.middle_name && (
                <div className="text-red-500 text-sm">{errors.middle_name}</div>
              )}

              <Field
                type="date"
                name="birthday"
                placeholder={t(
                  "admins.workers.create  worker.placeholders.birthday",
                )}
                lang={i18n.language}
                className="border p-2 w-full mb-2"
              />
              {errors.birthday && touched.birthday && (
                <div className="text-red-500 text-sm">{errors.birthday}</div>
              )}

              <Field
                name="phone"
                placeholder={t(
                  "admins.workers.create_worker.placeholders.phone",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.phone && touched.phone && (
                <div className="text-red-500 text-sm">{errors.phone}</div>
              )}

              <SpecialtyField />

              <Field
                name="login"
                placeholder={t(
                  "admins.workers.create_worker.placeholders.login",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.login && touched.login && (
                <div className="text-red-500 text-sm">{errors.login}</div>
              )}

              <Field
                type="password"
                name="password"
                placeholder={t(
                  "admins.workers.create_worker.placeholders.password",
                )}
                className="border p-2 w-full mb-4"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className=" text-gray-200 px-4 py-2 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
                >
                  {t("admins.workers.create_worker.save")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border text-gray-200 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
                >
                  {t("admins.workers.create_worker.cancelled")}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
