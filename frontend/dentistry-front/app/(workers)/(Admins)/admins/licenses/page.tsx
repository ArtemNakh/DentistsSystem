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

interface Worker {
  id: number;
  name: string;
  position: string;
}

interface License {
  id: number;
  title: string;
  issuedAt: string;
}
export const DenormalizeWorkers = createSelector(
  [
    (state: RootState) => state.workers,
    (state: RootState) => state.specialties,
    (state: RootState) => state.dentistries,
  ],
  (workersObj, specialtiesObj, dentistriesObj) => {
    const workers: IWorker[] = Object.values(workersObj ?? {});
    const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});
    const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});

    return workers.map((w) => {
      const specialty = specialties.find((s) => s.id === (w.specialty as any))!;

      const dentistry = dentistries.find((d) => d.id === (w.dentistry as any))!;

      return { ...w, specialty, dentistry };
    });
  },
);
export default function WorkersTable() {
  const workers = useAppSelector(DenormalizeWorkers);
  const auth = useAppSelector((state: { auth: AuthState }) => state.auth);

  const [expandedWorkerId, setExpandedWorkerId] = useState<number | null>(null);
  const licensesObj = useAppSelector((state: RootState) => state.licenses);
  const licenses = Object.values(licensesObj ?? {});

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth.user?.dentistry?.id) {
      dispatch(GetLicensesWorkers({ dentistryId: auth.user.dentistry.id }));
    }
  }, [dispatch, auth.user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Працівники стоматології</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Імʼя</th>
            <th className="border p-2">Посада</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <>
              <tr
                key={worker.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpandedWorkerId(
                    expandedWorkerId === worker.id ? null : worker.id,
                  )
                }
              >
                <td className="border p-2">{worker.name}</td>
                <td className="border p-2">{worker.middle_name}</td>
              </tr>

              {expandedWorkerId === worker.id && (
                <tr>
                  <td colSpan={2} className="border p-2 bg-gray-50">
                    <div>
                      <h3 className="font-semibold mb-2">Ліцензії:</h3>
                      {licenses.length === 0 ? (
                        <p className="text-gray-500">Немає ліцензій</p>
                      ) : (
                        <ul className="space-y-2">
                          {licenses
                            .filter((lic) => lic.worker === worker.id)
                            .map((lic) => (
                              <li
                                key={lic.id}
                                className="flex justify-between items-center border p-2 rounded"
                              >
                                <div>
                                  <span className="font-medium">
                                    {lic.number_license}
                                  </span>{" "}
                                  <span className="text-sm text-gray-500">
                                    (видано:{" "}
                                    {new Date(
                                      lic.issue_date,
                                    ).toLocaleDateString()}
                                    )
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    className="px-2 py-1 bg-blue-500 text-white rounded"
                                    onClick={() =>
                                      alert(`Оновити ліцензію ${lic.id}`)
                                    }
                                  >
                                    Оновити
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                    onClick={() =>
                                      alert(`Видалити ліцензію ${lic.id}`)
                                    }
                                  >
                                    Видалити
                                  </button>
                                </div>
                              </li>
                            ))}
                        </ul>
                      )}
                      <button
                        className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                        onClick={() =>
                          alert(
                            `Відкрити модальне створення ліцензії для працівника ${worker.id}`,
                          )
                        }
                      >
                        Додати ліцензію
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
