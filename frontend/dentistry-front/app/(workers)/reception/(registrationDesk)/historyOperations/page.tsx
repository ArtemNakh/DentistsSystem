"use client";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getHistoryAppointmentByDentistry } from "@/lib/redux/modules/Appointments/actions/GetHistoryAppointmentDentistry/GetHistoryAppointmentDentistry";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { ISpecialty } from "@/lib/redux/modules/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { useEffect, useState } from "react";
export const DenormalizeAppointments = createSelector(
  [
    (state: RootState) => state.appointments,
    (state: RootState) => state.workers,
    (state: RootState) => state.clients,
    (state: RootState) => state.dentistries,
    (state: RootState) => state.specialties,
  ],
  (
    appointmentsObj,
    workersObj,
    clientsObj,
    dentistriesObj,
    specialtiesObj,
  ): IAppointment[] => {
    const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
    const workers: IWorker[] = Object.values(workersObj ?? {});
    const clients: IClient[] = Object.values(clientsObj ?? {});
    const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
    const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});
    return appointments.map((appointment) => {
      const worker =
        workers.find((w) => w.id === (appointment.dentist as any)) ?? null;
      const client =
        clients.find((c) => c.id === (appointment.client as any)) ?? null;
      const dentistry =
        dentistries.find((d) => d.id === (worker?.dentistry as any)) ?? null;
      const specialty =
        specialties.find((s) => s.id === (worker?.specialty as any)) ?? null;
      return { ...appointment, dentist: worker, client, dentistry, specialty };
    });
  },
);

// сторінка яка показує усі операції для стоматології (із фільтром текущії, заплановані, зроблені,скасовано)
export default function HistoryOperationReception() {
  // const operation = [
  //   {
  //     id: "123",
  //     client_id: "321",
  //     worker_id: "321",
  //     appointment_date: "12.32.2121",
  //     notes: "test",
  //     status: "schedule completed wait_paid cancelled",
  //   },
  // ];

  const dispatch = useAppDispatch();
  const appointments = useAppSelector(DenormalizeAppointments);
  console.log("appointm", appointments);

  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  useEffect(() => {
    if (authUser.user) {
      console.log("work");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser.user) return;

    //отримання усі  appointment які були плоть до сьогодні
    dispatch(
      getHistoryAppointmentByDentistry({
        dentistryId: authUser.user.dentistry.id,
      }),
    );
  }, [authUser]);

  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);

  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);
  return (
    <>
      {" "}
      <div className="font-bold ">
        {/* Фільтр */}

        <div className=" w-full">
          <div className="mx-4    border border-gray-600  flex items-center gap-4 p-2  ">
            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Фіо Client</label>
              <input className="h-10 w-100 text-lg border border-gray-600 rounded px-2 focus:outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Фіо Worker</label>
              <input className="h-10 w-100 text-lg border border-gray-600 rounded px-2 focus:outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Specialty</label>
              <input className="h-10 w-60 text-lg border border-gray-600 rounded px-2 focus:outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Status </label>
              <input className="h-10 w-60 text-lg border border-gray-600 rounded px-2 focus:outline-none" />
            </div>

            <div className="flex flex-col">
              <label className="text-lg text-gray-200">Day</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="dd.mm.yyyy"
                  // value={}
                  // onChange={}
                  className="h-10 w-40 text-lg border border-gray-600 rounded px-2 focus:outline-none"
                  pattern="\d{2}\.\d{2}\.\d{4}"
                />
                <button className="h-10 px-4 text-lg rounded border border-gray-600 hover: text-gray-200">
                  Застосувати
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Список працівників */}

        <div className="w-full  ">
          <div className="mx-4">
            {appointments.length > 0 ? (
              <table className="w-full   border-collapse border border-gray-600 text-lg">
                <thead className="">
                  <tr>
                    <th className="border border-gray-400 px-2 py-1">Client</th>
                    <th className="border w-72 border-gray-400 px-1 py-1">
                      Worker
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Дата operation
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Status operaiton
                    </th>
                    <th className="border border-gray-400 px-2 py-1">Notes</th>
                    <th className="border border-gray-400 px-2 py-1">
                      Payment
                    </th>
                    <th className="border border-gray-400 px-2 py-1">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((text) => (
                    <tr
                      key={text.id}
                      className="bg-gray-100  text-gray-700 hover:bg-gray-100"
                    >
                      {/* <td className="border  border-gray-400 px-2 py-1 flex ">
                      <div className="mx-1"> {text.name}</div>
                      <div className="mr-1">{text.surname}</div>
                      <div>{text.middle_name}</div>
                      </td> */}
                      <td className="border border-gray-400 px-2 py-1">
                        <div className="flex h-full items-center">
                          <div className="mx-1">
                            {text.client?.surname} {text.client?.name}
                          </div>
                        </div>
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.dentist?.surname} {text.dentist?.name}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {/* {text.appointment_date} */}
                        {text.appointment_date
                          ? format(
                              new Date(text.appointment_date),
                              "dd.MM.yyyy HH:mm",
                            )
                          : "—"}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.status}
                      </td>
                      <td className="border border-gray-400 px-2 py-1">
                        {text.notes}
                        <button
                          onClick={() => setSelectedAppointment(text)}
                          className="text-blue-600 hover:underline"
                        >
                          Детальніше
                        </button>
                      </td>

                      <td className="border border-gray-400 px-2 py-1">
                        {text.payment ? text.payment.amount : "—"}
                        <button
                          onClick={() => setSelectedPayment(text.payment ?? null)}
                          className="text-blue-600 hover:underline"
                        >
                          Детальніше
                        </button>
                      </td>
                      <td className="border border-gray-600 px-2 py-2 text-center">
                        <button className=" text-gray-900 px-3 py-2 rounded hover:bg-[#795FAE] transition flex items-center justify-center">
                          {/* SVG іконка календаря */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-gray-900">Немає працівників</span>
            )}
            {selectedAppointment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <p>Список усіх дій які були зроблені (ПЕРЕРОБИТИ)</p>
                <div className="bg-white rounded-lg w-[500px] p-6 relative">
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>

                  <h2 className="text-xl font-bold mb-4">Деталі операції</h2>

                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong>Клієнт:</strong>{" "}
                      {selectedAppointment.client?.surname}{" "}
                      {selectedAppointment.client?.name}
                    </p>

                    <p>
                      <strong>Лікар:</strong>{" "}
                      {selectedAppointment.dentist?.surname}{" "}
                      {selectedAppointment.dentist?.name}
                    </p>

                    <p>
                      <strong>Дата:</strong>{" "}
                      {selectedAppointment.appointment_date
                        ? format(
                            new Date(selectedAppointment.appointment_date),
                            "dd.MM.yyyy HH:mm",
                          )
                        : "—"}
                    </p>

                    <p>
                      <strong>Статус:</strong> {selectedAppointment.status}
                    </p>

                    <p>
                      <strong>Нотатки:</strong>
                    </p>
                    <div className="border p-2 rounded bg-gray-100">
                      {selectedAppointment.notes || "—"}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedPayment && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <p>Список усіх дій які були зроблені (ПЕРЕРОБИТИ)</p>
                <div className="bg-white rounded-lg w-[500px] p-6 relative">
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>

                  <h2 className="text-xl font-bold mb-4">Деталі операції</h2>

                  <div className="space-y-2 text-gray-700"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
