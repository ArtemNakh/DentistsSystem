"use client";

import {
  UseDenormalizeSelector,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { useEffect, useState } from "react";
import ListShiftsWorker from "./components/ModalView/ListLShifts/ListShiftsWorker";
import React from "react";
import { getAllShiftsWorkers } from "@/lib/redux/modules/WorkerShifts/actions/GetShiftsToWorkers/GetShiftsToWorkers";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
import { useTranslation } from "react-i18next";
import { getShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/GetShiftsToWorker/GetShiftsToWorker";

export default function WorkersShiftsTable() {
  const { t } = useTranslation();
  const auth = useAppSelector((state: { auth: AuthState }) => state.auth);
  const workersObj = UseDenormalizeSelector((state) => state.workers);
  const workers: IWorker[] = Object.values(workersObj ?? {});
  const shiftsObj = UseDenormalizeSelector((state) => state.workerShifts);
  const shifts: IWorkerShifts[] = Object.values(shiftsObj ?? {});

  const [expandedWorkerId, setExpandedWorkerId] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth.user?.dentistry?.id) {
      dispatch(getShiftsWorker({ idWorker: auth.user.id }));
    }
  }, [dispatch, auth.user]);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">
        {t("doctor.workers_shifts.workers_shifts_info")}
      </h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-200 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-linear-to-l from-[#874FD1] to-[#6F6697]">
              <th className="border p-2">
                {" "}
                {t("doctor.workers_shifts.table_name.name")}
              </th>
              <th className="border p-2">
                {t("doctor.workers_shifts.table_name.middle_name")}
              </th>
              <th className="border p-2">
                {t("doctor.workers_shifts.table_name.surname")}
              </th>
              <th className="border p-2">
                {t("doctor.workers_shifts.table_name.specialization/type")}
              </th>
              <th className="border p-2">
                {t("doctor.workers_shifts.table_name.birthday")}
              </th>
              <th className="border p-2">
                {t("doctor.workers_shifts.table_name.phone")}
              </th>
              <th className="border p-2">
                {t("doctor.workers_shifts.table_name.status_acc")}
              </th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <React.Fragment key={worker.id}>
                <tr
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
                    {worker.active
                      ? t("doctor.workers_shifts.table_value.state_account.active")
                      : t("doctor.workers_shifts.table_value.state_account.inactive")}
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
    </div>
  );
}
