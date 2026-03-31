import { useAppDispatch } from "@/lib/redux/hooks";
import { MethodPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface AddActionsPageProps {
  onClose: () => void;
}

interface FormValues {
  appointmentId: number;
  actions: string[]; // Formik працює з рядками
  method_pay: string;
}


const initialValues: FormValues = {
  appointmentId: 0,
  actions: [""],
  method_pay: "CARD",
};

export default function AddActionsPage({ onClose }: AddActionsPageProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (values: FormValues, { setSubmitting }: any) => {
      try {
        // перетворюємо actions у числа
        const payload = {
          ...values,
          actions: values.actions.map((id) => Number(id)),
        };
console.log("payload",payload)
        // await dispatch(addActionsAndPayment(payload));
        onClose();
      } catch (err) {
        setError("Помилка при додаванні операцій: " + err);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, onClose]
  );

  return (
    <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50">
      <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] p-6 rounded shadow-lg w-2/3 h-2/3 overflow-auto">
        <h2 className="text-base font-bold mb-4">
          Додавання операцій до запису
        </h2>

        <Formik initialValues={initialValues} onSubmit={onSubmit}>
          {({ values }) => (
            <Form>
              {/* Appointment ID */}
              <label className="block mb-2">ID запису (appointmentId)</label>
              <Field
                name="appointmentId"
                type="number"
                className="border p-2 w-full mb-4"
              />
              <ErrorMessage
                name="appointmentId"
                component="div"
                className="text-red-500"
              />

              {/* Actions (масив ID операцій) */}
              <label className="block mb-2">ID операцій (operation_list)</label>
              <FieldArray name="actions">
                {({ push, remove }) => (
                  <div>
                    {values.actions.map((_, index) => (
                      <div key={index} className="flex mb-2">
                        <Field
                          name={`actions.${index}`}
                          type="number"
                          className="border p-2 flex-1"
                          placeholder="ID операції"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Видалити
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Додати ще операцію
                    </button>
                  </div>
                )}
              </FieldArray>

              {/* Method Pay */}
              <label className="block mt-4 mb-2">Спосіб оплати</label>
              <Field
                as="select"
                name="method_pay"
                className="border p-2 w-full mb-4"
              >
                <option value="CARD">CARD</option>
                <option value="CASH">CASH</option>
                <option value="TRANSFER">TRANSFER</option>
              </Field>

              {/* Submit */}
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Зберегти
              </button>
            </Form>
          )}
        </Formik>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 border border-gray-700 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Закрити
        </button>
      </div>
    </div>
  );
}
