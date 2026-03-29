"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { GetLicensesWorkers } from "@/lib/redux/modules/Licenses/actions/GetAllLicensesWorkers/GetAllLicensesWorkers";

import { ISpecialty } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import ListShiftsWorker from "./components/ModalView/ListLShifts/ListShiftsWorker";
import React from "react";
import { getAllShiftsWorkers } from "@/lib/redux/modules/WorkerShifts/actions/GetShiftsToWorkers/GetShiftsToWorkers";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";


export const DenormalizeWorkers = createSelector(
  [
    (state: RootState) => state.workers,
  ],
  (workersObj) => {
    const workers: IWorker[] = Object.values(workersObj ?? {});
    return workers.map((w) => ({
      ...w,
      specialty: w.specialty,
      dentistry: w.dentistry,
    }));
  },
);

export const DenormalizeWorkerShifts = createSelector(
  [
    (state: RootState) => state.workerShifts,
    (state: RootState) => state.workers,
  ],
  (workerShiftsObj, workersObj) => {
    const workerShifts: IWorkerShifts[] = Object.values(workerShiftsObj ?? {});
    const workers: IWorker[] = Object.values(workersObj ?? {});

    return workerShifts.map((shift) => {
      const worker = workers.find((w) => w.id === (shift.worker as any))!;
      return { ...shift, worker };
    });
  },
);
export default function WorkersShiftsTable() {
  const workers = useAppSelector(DenormalizeWorkers);
  const shifts = useAppSelector(DenormalizeWorkerShifts);
  const auth = useAppSelector((state: { auth: AuthState }) => state.auth);

  const [expandedWorkerId, setExpandedWorkerId] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth.user?.dentistry?.id) {
      dispatch(getAllShiftsWorkers({ idDentisty: auth.user.dentistry.id }));
    }
  }, [dispatch, auth.user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Працівники стоматології  / графік роботи</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-linear-to-l from-[#874FD1] to-[#6F6697]">
            <th className="border p-2">Імʼя</th>
            <th className="border p-2">По-батькові</th>
            <th className="border p-2">Фамілія</th>
            <th className="border p-2">Спеціалізація/Тип</th>
            <th className="border p-2">Дата народження</th>
            <th className="border p-2">телефон</th>

            <th className="border">Статус аккаунта</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <React.Fragment key={worker.id}>
              <tr
                key={worker.id}
                className="cursor-pointer transition hover:bg-black/20"
                onClick={() =>
                  setExpandedWorkerId(
                    expandedWorkerId === worker.id ? null : worker.id,
                  )
                }
              >
                <td className="border p-2">{worker.name}</td>
                <td className="border p-2">{worker.middle_name}</td>

                <td className="border p-2">{worker.surname}</td>
                <td className="border p-2">
                  <div className="flex justify-between w-full">
                    <span>{worker.specialty?.name}</span>
                    <span>{worker.specialty?.type}</span>
                  </div>
                </td>

                <td className="border p-2">
                  {new Date(worker.birthday).toLocaleDateString()}
                </td>

                <td className="border p-2">{worker.phone}</td>
                <td className="border p-2">
                  {worker.active ? "Активний" : "Неактивний"}
                </td>
              </tr>
              {expandedWorkerId === worker.id && (
                <tr>
                  <ListShiftsWorker workerId={worker.id} shifts={shifts} />
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
