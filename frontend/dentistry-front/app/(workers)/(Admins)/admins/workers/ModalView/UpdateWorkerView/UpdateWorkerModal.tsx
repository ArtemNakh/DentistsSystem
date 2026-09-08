import { useAppDispatch } from "@/lib/redux/hooks";
import { Formik, Form, Field } from "formik";
import { useCallback } from "react";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import {
  UpdateWorker,
  UpdateWorkerPayload,
} from "@/lib/redux/modules/Workers/actions/UpdateWorker/UpdateWorker";
import SpecialtyField from "./components/SpecialtyField";
import { UpdateWorkerSchema } from "./schema/UpdateWorkerSchema";
import { useTranslation } from "react-i18next";

export default function UpdateWorkerModal({
  worker,
  onClose,
}: {
  worker: IWorker;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onSubmit = useCallback(
    async (values: UpdateWorkerPayload, { setSubmitting }: any) => {
      try {
        dispatch(UpdateWorker(values));
        onClose();
      } catch (err) {
        console.error("Error during updating worker:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, onClose],
  );

  return (
    <Formik<UpdateWorkerPayload>
      initialValues={{
        id: worker.id,
        name: worker.name,
        surname: worker.surname,
        middle_name: worker.middle_name,
        birthday: new Date(worker.birthday).toISOString().split("T")[0], // рядок
        phone: worker.phone,
        specialtyId: worker.specialty?.id ?? 0,
        dentistryId: worker.dentistry?.id ?? 0,
        login: worker.login,
        password: worker.password,
        active: worker.active ?? true,
      }}
      validationSchema={UpdateWorkerSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-200 p-6 rounded w-96 text-gray-600">
              <h2 className="text-lg font-bold mb-4">
                {t("admins.workers.update_worker.update_worker")}
              </h2>
              <Field
                name="name"
                placeholder={t(
                  "admins.workers.update_worker.placeholders.name",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}

              <Field
                name="surname"
                placeholder={t(
                  "admins.workers.update_worker.placeholders.surname",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.surname && touched.surname && (
                <div className="text-red-500 text-sm">{errors.surname}</div>
              )}

              <Field
                name="middle_name"
                placeholder={t(
                  "admins.workers.update_worker.placeholders.middle_name",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.middle_name && touched.middle_name && (
                <div className="text-red-500 text-sm">{errors.middle_name}</div>
              )}

              <Field
                type="date"
                name={t("admins.workers.update_worker.placeholders.birthday")}
                className="border p-2 w-full mb-2"
              />
              {errors.birthday && touched.birthday && (
                <div className="text-red-500 text-sm">{errors.birthday}</div>
              )}

              <Field
                name="phone"
                placeholder={t(
                  "admins.workers.update_worker.placeholders.phone",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.phone && touched.phone && (
                <div className="text-red-500 text-sm">{errors.phone}</div>
              )}

              <SpecialtyField />
              {errors.specialtyId && touched.specialtyId && (
                <div className="text-red-500 text-sm">{errors.specialtyId}</div>
              )}

              <Field
                name="login"
                placeholder={t(
                  "admins.workers.update_worker.placeholders.login",
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
                  "admins.workers.update_worker.placeholders.password",
                )}
                className="border p-2 w-full mb-4"
              />
              {errors.password && touched.password && (
                <div className="text-red-500 text-sm">{errors.password}</div>
              )}
              <label className="flex items-center gap-2 mb-2">
                <Field type="checkbox" name="active" />
                <span>{t("admins.workers.update_worker.active")}</span>
              </label>
              {errors.active && touched.active && (
                <div className="text-red-500 text-sm">{errors.active}</div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="text-gray-200 px-4 py-2 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
                >
                  {t("admins.workers.update_worker.update")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border text-gray-200 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
                >
                  {t("admins.workers.update_worker.cancelled")}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
