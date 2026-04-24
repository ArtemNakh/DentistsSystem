"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useEffect, useState } from "react";
import { GetAppointmentById } from "@/lib/redux/modules/Appointments/actions/GetById/GetAppointmentsById";
import { IOperationList } from "@/lib/redux/modules/OperationList/OperationList.interface";
import { IAppointmentActions } from "@/lib/redux/modules/AppointmentsActions/AppointmentActions.interface";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import AddActionsPage from "./components/AddActionsPage";
import { AddingOperationAction } from "./schemes/AddingOperationAction";
import { useTranslation } from "react-i18next";
import { GetActionsByTitle } from "@/lib/redux/modules/FindingOperationList/OperationList/actions/GetActionByTitle/GetActionByTitle";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import {
  CompleteAppointmentActions,
  CompleteAppointmentActionsPayload,
} from "@/lib/redux/modules/AppointmentsActions/actions/actions/CompleteAppointmentActions/CompleteAppointmentActions";
import { MethodPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { denormalize } from "normalizr";
import { appointmentSchema } from "@/lib/redux/modules/Appointments/Appointments.Entity";

  // export const makeDenormalizeAppointmentById = (appointmentId: number) =>
  //   createSelector(
  //     [
  //       (state: RootState) => state.appointments,
  //       (state: RootState) => state.clients,
  //       (state: RootState) => state.workers,
  //       (state: RootState) => state.specialties,
  //       (state: RootState) => state.dentistries,
  //     ],
  //     (
  //       appointmentsObj,
  //       clientsObj,
  //       workersObj,
  //       specialtiesObj,
  //       dentistriesObj,
  //     ) => {
  //       const a = appointmentsObj?.[appointmentId];
  //       if (!a) return undefined;

  //       const client = clientsObj?.[a.client as unknown as number];
  //       const dentist = workersObj?.[a.dentist as unknown as number];

  //       const specialty =
  //         dentist?.specialty !== undefined
  //           ? specialtiesObj?.[dentist.specialty as unknown as number]
  //           : undefined;

  //       const dentistry =
  //         dentist?.dentistry !== undefined
  //           ? dentistriesObj?.[dentist.dentistry as unknown as number]
  //           : undefined;

  //       return {
  //         ...a,
  //         client,
  //         dentist: dentist
  //           ? {
  //               ...dentist,
  //               specialty,
  //               dentistry,
  //             }
  //           : undefined,
  //       } as IAppointment;
  //     },
  //   );

  interface AddActionsPageProps {
    onClose: () => void;
  }

  interface FormValues {
    appointmentId: number;
    actions: string[]; // Formik працює з рядками
    method_pay: MethodPayment;
  }

  const initialValues: FormValues = {
    appointmentId: 0,
    actions: [""],
    method_pay: MethodPayment.CARD,
  };

  export default function OperationClient({ id }: { id: string }) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

    const appointmentId = Number(id);


    // const entities = useAppSelector((state: RootState) => state.appointments);
    // const entities = useAppSelector((state: RootState) => state.entities);
// const entities = useAppSelector((state: RootState) => ({
//   appointments: state.appointments,
//   clients: state.clients,
//   workers: state.workers,
//   specialties: state.specialties,
//   dentistries: state.dentistries,
//   payments: state.payments,
//   appointmentActions: state.appointmentActions,
//   operationList: state.operationList,
// }));
const entities = useAppSelector((state: RootState) => state);
console.log("entit",entities)

const appointment = denormalize(
  appointmentId,
  appointmentSchema,
  entities
);

console.log("appointqweqwe",appointment)
    // const selector = makeDenormalizeAppointmentById(appointmentId);
    // const appointment = useAppSelector((state: RootState) => selector(state));


    const [error, setError] = useState<string | null>(null);

    let operationList = useAppSelector(
      (state: RootState) => state.findingOperationList,
    );

    const [showOperationListModal, setShowOperationListModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOperationList, setFilteredOperationList] = useState<
      IOperationList[]
    >([]);
    const [selectedOperationName, setSelectedOperationName] = useState(""); // локальний стан для відображення

    

    const onSubmit = useCallback(
      async (values: FormValues, { setSubmitting }: any) => {
        try {
          const payload: CompleteAppointmentActionsPayload = {
            ...values,
            actions: values.actions.map((id) => Number(id)),
          };
          console.log("payload", payload);
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
        }
      },
      [dispatch],
    );

    

    useEffect(() => {
      if (!appointment) {
      
        dispatch(GetAppointmentById({ appointmentId }));
      }
    }, [dispatch, appointmentId, appointment]);

    useEffect(() => {
      if (searchQuery.length > 2) {
        if (authUser.user?.dentistry?.id) {
          dispatch(
            GetActionsByTitle({
              title: searchQuery,
              dentistryId: authUser.user.dentistry.id,
            }),
          );
        }
      }
    }, [searchQuery, dispatch]);

    useEffect(() => {
      if (searchQuery.length > 2) {
        const normalized: IOperationList[] = Object.values(operationList ?? {});
        setFilteredOperationList(normalized);
      } else {
        setFilteredOperationList([]);
      }
    }, [searchQuery, operationList]);

  if (!appointment ) {
    return <p>Завантаження...</p>;
  } 


    console.log("Appointments:", appointment);


    return (
      <div className="p-6 bg-gray-100 rounded shadow-md text-gray-700 text-base">
        <h2 className="text-xl font-bold mb-4">
          Запис на {new Date(appointment.appointment_date).toLocaleString()}
        </h2>
      <p>
        <strong>Лікар:</strong> {appointment.dentist?.surname}{" "}
        {appointment.dentist?.name} {appointment.dentist?.middle_name} :{" "}
        {appointment.dentist?.specialty?.name}
      </p>
      <p>
        <strong>Пацієнт</strong> {appointment.client?.surname}{" "}
        {appointment.client?.name} {appointment.client?.middle_name}{" "}
        {appointment.client?.birthdate}
      </p>
      <p>
        <strong>Группа крові</strong> {appointment.client?.blood_group}{" "}
        {appointment.client?.blood_resus}
      </p>
      <p>
        <strong>Хвороби</strong> {appointment.client?.allergic_diseases}
      </p>

      <Formik
        initialValues={{
          appointmentId,
          actions: [],
          method_pay: MethodPayment.CARD,
        }}
        validationSchema={AddingOperationAction}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <Field type="hidden" name="appointmentId" />
            <ErrorMessage
              name="appointmentId"
              component="div"
              className="text-red-500"
            />

            <label className="block mb-2">Дії операції</label>
            <FieldArray name="actions">
              {({ remove, push }) => (
                <div>
                  {values.actions.map((actionId, index) => {
                    // знаходимо операцію по ID
                    const operation = filteredOperationList.find(
                      (op) => op.id === Number(actionId),
                    );

                    return (
                      <div key={index} className="flex mb-2">
                        {/* приховане поле з ID */}
                        <Field name={`actions.${index}`} type="hidden" />

                        {/* показуємо назву операції */}
                        <input
                          type="text"
                          value={operation ? operation.name : ""}
                          readOnly
                          className="border p-2 flex-1 bg-gray-100"
                        />

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Видалити
                        </button>
                      </div>
                    );
                  })}

                  <ErrorMessage
                    name="actions"
                    component="div"
                    className="text-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOperationListModal(true)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Додати дію
                  </button>

                  {showOperationListModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                      <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] border-2 border-gray-600 rounded-lg shadow-lg p-6 w-2/3 max-w-lg">
                        <h3 className="text-lg font-bold mb-4">
                          {t("Пошук операції")}
                        </h3>

                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full p-2 border border-gray-400 rounded mb-4"
                          placeholder={t("Введіть назву")}
                        />

                        <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded">
                          {filteredOperationList.map((operation) => (
                            <li
                              key={operation.id}
                              onClick={() => {
                                push(operation.id); // додаємо ID у Formik
                                setShowOperationListModal(false);
                              }}
                              className="p-2 hover:bg-[#7551B0] cursor-pointer"
                            >
                              {operation.name} — {operation.description} (Ціна:{" "}
                              {operation.price})
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => setShowOperationListModal(false)}
                          className="mt-4 px-4 py-2 bg-[#7C5CB6] border border-gray-700 text-white rounded hover:bg-purple-700"
                        >
                          {t("Закрити")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </FieldArray>

            <label className="block mt-4 mb-2">Спосіб оплати</label>
            <Field
              as="select"
              name="method_pay"
              className="border p-2 w-full mb-4"
            >
              <option value={MethodPayment.CARD}>CARD</option>
              <option value={MethodPayment.CASH}>CASH</option>
              <option value={MethodPayment.TRANSFER}>TRANSFER</option>
            </Field>
            <ErrorMessage
              name="method_pay"
              component="div"
              className="text-red-500"
            />
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
    </div>
  );
}
