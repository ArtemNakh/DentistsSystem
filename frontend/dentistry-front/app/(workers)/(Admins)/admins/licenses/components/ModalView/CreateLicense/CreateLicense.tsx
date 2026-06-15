"use client";

import { Field, Form, Formik } from "formik";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  CreateLicense,
  CreateLicensePayload,
} from "@/lib/redux/modules/Licenses/actions/CreateLicense/CreateLicense";
import { CreateLicenseSchema } from "./schemes/CreateLicense.schema";
import { useTranslation } from "react-i18next";

export default function CreateLicenseModal({
  workerId,
  onClose,
}: {
  workerId: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onSubmit = async (
    values: CreateLicensePayload,
    { setSubmitting }: any,
  ) => {
    try {
      await dispatch(CreateLicense(values));
      onClose();
    } catch (err) {
      console.error("Error during adding new license: " + err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        workerId,
        issue_date: "",
        issued_by: "",
        number_license: "",
        expiration_date: "",
      }}
      validationSchema={CreateLicenseSchema(t)}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-200 p-6 rounded w-96 text-gray-600">
              <h2 className="text-lg font-bold mb-4">
                {t("admins.license.create_license.new_license")}
              </h2>

              {/* Дата видачі ліцензії */}
              <label className="text-sm font-medium">
                {" "}
                {t("admins.license.create_license.issue_date")}
              </label>
              <Field
                type="date"
                name="issue_date"
                className="border p-2 w-full mb-2"
              />
              {errors.issue_date && touched.issue_date && (
                <div className="text-red-500 text-sm">{errors.issue_date}</div>
              )}

              {/* Орган, що видав ліцензію */}
              <label className="text-sm font-medium">
                {" "}
                {t("admins.license.create_license.issued_by")}
              </label>
              <Field
                name="issued_by"
                placeholder={t(
                  "admins.license.create_license.placeholder.issued_by",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.issued_by && touched.issued_by && (
                <div className="text-red-500 text-sm">{errors.issued_by}</div>
              )}

              {/* Номер ліцензії */}
              <label className="text-sm font-medium">
                {" "}
                {t("admins.license.create_license.number_license")}
              </label>
              <Field
                name="number_license"
                placeholder={t(
                  "admins.license.create_license.placeholder.number_license",
                )}
                className="border p-2 w-full mb-2"
              />
              {errors.number_license && touched.number_license && (
                <div className="text-red-500 text-sm">
                  {errors.number_license}
                </div>
              )}

              {/* Дата закінчення дії ліцензії */}
              <label className="text-sm font-medium">
                {" "}
                {t("admins.license.create_license.expiration_date")}
              </label>
              <Field
                type="date"
                name="expiration_date"
                className="border p-2 w-full mb-4"
              />
              {errors.expiration_date && touched.expiration_date && (
                <div className="text-red-500 text-sm">
                  {errors.expiration_date}
                </div>
              )}

              {/* Кнопки дій */}
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="text-gray-200 px-4 py-2 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
                >
                  {t("admins.license.create_license.save")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border text-gray-200 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
                >
                  {t("admins.license.create_license.cancel")}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
