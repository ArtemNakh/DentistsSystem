"use client";

import {
  UseDenormalizeSelector,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { ILicense } from "@/lib/redux/modules/Licenses/Licenses.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { GetWorkerById } from "@/lib/redux/modules/Workers/actions/GetWorkerById/getWorkerById";
import { GetLicensesWorker } from "@/lib/redux/modules/Licenses/actions/GetLicensesWorker/GetLicensesWorker";

export default function WorkersTable() {
  const workersObj = UseDenormalizeSelector((state: RootState) => state.workers);
  const workers: IWorker[] = Object.values(workersObj ?? {});

  const auth = useAppSelector((state: { auth: AuthState }) => state.auth);
  console.log("auth", auth);

  const licensesObj = UseDenormalizeSelector((state: RootState) => state.licenses);
  const licenses: ILicense[] = Object.values(licensesObj ?? {});

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auth.user?.id) {
      dispatch(GetWorkerById({ id: auth.user.id }));
    }
  }, [dispatch, auth.user]);

  useEffect(() => {
    if (auth.user?.id) {
      dispatch(GetLicensesWorker({ workerId: auth.user.id }));
    }
  }, [dispatch, auth.user]);

  console.log("workers", workers);

  const currentWorker = workers.find((w) => w.id === auth.user?.id);

  if (!currentWorker) {
    return (
      <div className="p-4 text-center text-gray-300">
        Немає даних для поточного користувача
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Профіль користувача */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <h2 className="text-2xl font-black  mb-4 text-gray-800">Мій профіль</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-xl  font-bold text-gray-500">Імʼя</p>
            <p className="text-lg">{currentWorker.name}</p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">По-батькові</p>
            <p className="text-lg">{currentWorker.middle_name}</p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">Фамілія</p>
            <p className="text-lg">{currentWorker.surname}</p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">Спеціалізація</p>
            <p className="text-lg">
              {currentWorker.specialty?.name} ({currentWorker.specialty?.type})
            </p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">Дата народження</p>
            <p className="text-lg">
              {new Date(currentWorker.birthday).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">Телефон</p>
            <p className="text-lg">{currentWorker.phone}</p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">Статус аккаунта</p>
            <p className="text-lg">
              {currentWorker.active ? "Активний" : "Неактивний"}
            </p>
          </div>
        </div>
      </div>

      {/* Ліцензії */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">
          Мої ліцензії
        </h3>
        {licenses.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-200 text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="border p-2">Номер ліцензії</th>
                <th className="border p-2">Видана ким</th>
                <th className="border p-2">Дата видачі</th>
                <th className="border p-2">Дата закінчення</th>
                <th className="border p-2">Створено</th>
                <th className="border p-2">Оновлено</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license) => (
                <tr key={license.id} className="hover:bg-gray-50 transition">
                  <td className="border p-2">{license.number_license}</td>
                  <td className="border p-2">{license.issued_by}</td>
                  <td className="border p-2">
                    {new Date(license.issue_date).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {new Date(license.expiration_date).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {new Date(license.created_at).toLocaleDateString()}
                  </td>
                  <td className="border p-2">
                    {new Date(license.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Немає ліцензій</p>
        )}
      </div>
    </div>
  );

  
}
