"use client";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { SetNewPasswordClient } from "@/lib/redux/modules/AuthUser/actions/SetNewPasswordClient/SetNewPasswordClient";
import LanguageSwitch from "@/app/components/LanguageSwitch";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { NewPasswordSchema } from "./schema/NewPasswordSchema.schema";

export default function NewPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const handleSubmit = async (
    values: { password: string; confirmPassword: string },
    { setStatus }: any,
  ) => {
    if (!token) {
      setStatus(t("new-password.token_not_found"));
      return;
    }

    try {
      await dispatch(
        SetNewPasswordClient({ token, password: values.password }),
      );
      setStatus(t("new-password.change_pass_successfuly"));
    } catch (error: any) {
      setStatus(t("new-password.error_change_pass"));
    }
  };

  return (
    <div className="flex items-center justify-center py-4 bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-end mb-2">
          <LanguageSwitch
            buttonClassName="rounded p-1 text-gray-700 hover:bg-gray-300 border border-gray-400"
            dropdownClassName="absolute mt-2 w-auto rounded-md shadow-lg border border-gray-600 bg-gray-300 text-gray-900"
            itemClassName="w-full px-2 py-2 text-sm hover:bg-gray-400"
            activeItemClassName="bg-gray-400 font-bold"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-yellow-600 mb-6">
          {t("new-password.create_new_password")}
        </h2>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validationSchema={NewPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ status }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("new-password.new_password")}
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400 text-gray-700"
                  placeholder={t("new-password.placeholder_new_password")}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("new-password.verify_password")}
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 placeholder:text-gray-400 text-gray-700"
                  placeholder={t("new-password.repeat_password")}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105"
                style={{ background: "linear-gradient(90deg,#FACC15,#EAB308)" }}
              >
                {t("new-password.change_password")}
              </button>

              {status && (
                <p className="mt-4 text-center text-sm text-gray-700">
                  {status}
                </p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
