import { MethodPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AddingOperationAction } from "../schemes/AddingOperationAction";
import { useCallback, useState } from "react";
import {
  CompleteAppointmentActions,
  CompleteAppointmentActionsPayload,
} from "@/lib/redux/modules/AppointmentsActions/actions/actions/CompleteAppointmentActions/CompleteAppointmentActions";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";
import MethodPayField from "./FormsOperationComponent/MethodPayField";
import { ActionsOperationField } from "./FormsOperationComponent/ActionsOperationField";
import { useRouter } from "next/navigation";

interface FormValues {
  appointmentId: number;
  actions: string[];
  method_pay: MethodPayment;
}

interface FormOperationProps {
  appointmentId: number;
}
export default function FormOperation({ appointmentId }: FormOperationProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: FormValues, { setSubmitting }: any) => {
      try {
        const payload: CompleteAppointmentActionsPayload = {
          ...values,
          actions: values.actions.map((id) => Number(id)),
        };
        await dispatch(
          CompleteAppointmentActions({
            appointmentId: payload.appointmentId,
            actions: payload.actions,
            method_pay: payload.method_pay,
          }),
        );
      } catch (err) {
        setError("Помилка при додаванні операцій: " + err);
      } finally {
        setSubmitting(false);
        router.push("/doctor/calendar");
      }
    },
    [dispatch],
  );

  return (
    <>
      {" "}
      <Formik
        initialValues={{
          appointmentId,
          actions: [],
          method_pay: MethodPayment.CARD,
        }}
        validationSchema={AddingOperationAction}
        onSubmit={onSubmit}
      >
        {() => (
          <Form>
            <Field type="hidden" name="appointmentId" />
            <ErrorMessage
              name="appointmentId"
              component="div"
              className="text-red-500"
            />

            <ActionsOperationField />
            <MethodPayField />

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {t("doctor.operation.save")}
            </button>
          </Form>
        )}
      </Formik>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </>
  );
}
