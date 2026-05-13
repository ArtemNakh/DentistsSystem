
"use client";

import {
  UseDenormalizeSelector,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { GetLicensesWorkers } from "@/lib/redux/modules/Licenses/actions/GetAllLicensesWorkers/GetAllLicensesWorkers";
import { ILicense } from "@/lib/redux/modules/Licenses/Licenses.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { useEffect, useState } from "react";
import ListLicensesWorker from "./components/ModalView/ListLicenses/ListLicensesWorker";
import React from "react";

export default function WorkersTable() {
  const workersObj = UseDenormalizeSelector((state) => state.workers);
  const workers: IWorker[] = Object.values(workersObj ?? {});
 const auth = useAppSelector((state: { auth: AuthState }) => state.auth);

  const [expandedWorkerId, setExpandedWorkerId] = useState<number | null>(null);
  const licensesObj = UseDenormalizeSelector((state) => state.licenses);
  const licenses: ILicense[] = Object.values(licensesObj ?? {});

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth.user?.dentistry?.id) {
      dispatch(GetLicensesWorkers({ dentistryId: auth.user.dentistry.id }));
    }
  }, [dispatch, auth.user]);

  return (
  <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Працівники стоматології</h2>
    <div className="overflow-x-auto"> {/* контейнер для прокрутки */}
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-linear-to-l from-[#874FD1] to-[#6F6697]">
            <th className="border p-2">Імʼя</th>
            <th className="border p-2">По-батькові</th>
            <th className="border p-2">Фамілія</th>
            <th className="border p-2">Спеціалізація/Тип</th>
            <th className="border p-2">Дата народження</th>
            <th className="border p-2">Телефон</th>
            <th className="border p-2">Статус аккаунта</th>
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
                  {worker.active ? "Активний" : "Неактивний"}
                </td>
              </tr>
              {expandedWorkerId === worker.id && (
                <tr>
                  <ListLicensesWorker
                    workerId={worker.id}
                    licenses={licenses}
                  />
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
