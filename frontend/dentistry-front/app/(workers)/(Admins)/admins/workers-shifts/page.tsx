"use client";

import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import ListShiftsWorker from "./components/ModalView/ListLShifts/ListShiftsWorker";
import React from "react";
import { getAllShiftsWorkers } from "@/lib/redux/modules/WorkerShifts/actions/GetShiftsToWorkers/GetShiftsToWorkers";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
import { useTranslation } from "react-i18next";
import { getShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/GetShiftsToWorker/GetShiftsToWorker";
import { getWorkersDentistry } from "@/lib/redux/modules/Workers/actions/GetWorkersDentistry/GetWorkersDentistry";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";

export default function WorkersShiftsTable() {
  const { t } = useTranslation();
  const workers: IWorker[] = Object.values(
    UseDenormalizeSelector<IWorker[]>((state: RootState) => state.workers),
  );
  const shifts: IWorkerShifts[] = Object.values(
    UseDenormalizeSelector<IWorkerShifts[]>(
      (state: RootState) => state.workerShifts,
    ),
  );
  const auth: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const [expandedWorkerId, setExpandedWorkerId] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth) {
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getWorkersDentistry({ idDentistry: auth?.dentistry?.id, }));
  }, [dispatch, auth?.dentistry?.id]);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">
        {t("admins.workers_shifts.title")}
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-linear-to-l from-[#874FD1] to-[#6F6697]">
            <th className="border p-2">
              {t("admins.workers_shifts.table_head.name")}
            </th>
            <th className="border p-2">
              {t("admins.workers_shifts.table_head.middle_name")}
            </th>
            <th className="border p-2">
              {t("admins.workers_shifts.table_head.surname")}
            </th>
            <th className="border p-2">
              {t("admins.workers_shifts.table_head.specialization")}
            </th>
            <th className="border p-2">
              {t("admins.workers_shifts.table_head.birthday")}
            </th>
            <th className="border p-2">
              {t("admins.workers_shifts.table_head.phone")}
            </th>
            <th className="border">
              {t("admins.workers_shifts.table_head.status_acc")}
            </th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <React.Fragment key={worker.id}>
              <tr
                key={worker.id}
                className="cursor-pointer transition hover:bg-black/20"
                onClick={() => {
                  const newExpandedId =
                    expandedWorkerId === worker.id ? null : worker.id;
                  setExpandedWorkerId(newExpandedId);

                  if (newExpandedId) {
                    dispatch(getShiftsWorker({ idWorker: worker.id }));
                  }
                }}
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
                  {worker.active
                    ? t("admins.workers_shifts.status_type.active")
                    : t("admins.workers_shifts.status_type.no_active")}
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
