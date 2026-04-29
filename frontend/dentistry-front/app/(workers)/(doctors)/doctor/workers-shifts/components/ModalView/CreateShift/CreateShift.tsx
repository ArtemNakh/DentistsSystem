"use client";

import { Form, Formik } from "formik";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  CreateShiftsWorker,
  CreateShiftsWorkerPayload,
} from "@/lib/redux/modules/WorkerShifts/actions/CreateWorkerShifts/CreateWorkerShifts";
import { CreateWorkerShiftSchema } from "./schemes/CreateShift.schema";
import ModalWrapper from "./components/ModalWrapper";
import FormField from "./components/FormField";
import ActionButtons from "./components/ActionButtons";
import { useTranslation } from "react-i18next";


export default function CreateWorkerShiftModal({
  workerId,
  onClose,
}: {
  workerId: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const onSubmit = async (
    values: CreateShiftsWorkerPayload,
    { setSubmitting }: any,
  ) => {
    try {
      await dispatch(CreateShiftsWorker(values));
      console.log("send create new shift", values);
      onClose();
    } catch (err) {
      console.error("Error during adding new shift: " + err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        workerId,
        shift_date: "",
        start_time: "",
        end_time: "",
      }}
      validationSchema={CreateWorkerShiftSchema(t)}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <ModalWrapper>
            <h2 className="text-lg font-bold mb-4">
              {t("doctor.workers_shifts.adding_new_shift.name")}
            </h2>

            <FormField
              label={t(
                "doctor.workers_shifts.adding_new_shift.form_field.date_shift",
              )}
              name="shift_date"
              type="date"
              errors={errors}
              touched={touched}
            />
            <FormField
              label={t(
                "doctor.workers_shifts.adding_new_shift.form_field.time_start",
              )}
              name="start_time"
              type="time"
              errors={errors}
              touched={touched}
            />
            <FormField
              label={t(
                "doctor.workers_shifts.adding_new_shift.form_field.time_end",
              )}
              name="end_time"
              type="time"
              errors={errors}
              touched={touched}
            />

            <ActionButtons onClose={onClose} />
          </ModalWrapper>
        </Form>
      )}
    </Formik>
  );
}
