import { MethodPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export default function MethodPayField() {
  const { t } = useTranslation();
  return (
    <>
      <label className="block mt-4 mb-2">
        {t("doctor.operation.method_pay.name")}
      </label>
      <Field as="select" name="method_pay" className="border p-2 w-full mb-4">
        <option value={MethodPayment.CARD}>
          {" "}
          {t("doctor.operation.method_pay.method.card")}
        </option>
        <option value={MethodPayment.CASH}>
          {" "}
          {t("doctor.operation.method_pay.method.cash")}
        </option>
        <option value={MethodPayment.TRANSFER}>
          {t("doctor.operation.method_pay.method.transfer")}
        </option>
      </Field>
      <ErrorMessage
        name="method_pay"
        component="div"
        className="text-red-500"
      />
    </>
  );
}
