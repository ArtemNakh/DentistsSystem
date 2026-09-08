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
import ListLicensesWorker from "./components/ModalView/ListLicenses/ListLicensesWorker";
import { useTranslation } from "react-i18next";

export default function WorkersTable() {
  const { t } = useTranslation();
  const workers: IWorker[] = Object.values(
    UseDenormalizeSelector((state: RootState) => state.workers) ?? {},
  );

  const auth = useAppSelector((state: { auth: AuthState }) => state.auth);

  const licenses: ILicense[] = Object.values(
    UseDenormalizeSelector((state: RootState) => state.licenses) ?? {},
  );

  const dispatch = useAppDispatch();

  //отримання працівникеа по id
  useEffect(() => {
    if (auth.user?.id) {
      dispatch(GetWorkerById({ id: auth.user.id }));
    }
  }, [dispatch, auth.user]);

  //отримання усіх ліцензій для працівника
  useEffect(() => {
    if (auth.user?.id) {
      dispatch(GetLicensesWorker({ workerId: auth.user.id }));
    }
  }, [dispatch, auth.user]);

  const currentWorker = workers.find((w) => w.id === auth.user?.id);

  if (!currentWorker) {
    return (
      <div className="p-4 text-center text-gray-300">
        {t("doctor.licenses.no_value")}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Профіль користувача */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <h2 className="text-2xl font-black  mb-4 text-gray-800">
          {t("doctor.licenses.profile.title")}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="text-xl  font-bold text-gray-500">
              {t("doctor.licenses.profile.name")}
            </p>
            <p className="text-lg">{currentWorker.name}</p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">
              {t("doctor.licenses.profile.middle_name")}
            </p>
            <p className="text-lg">{currentWorker.middle_name}</p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">
              {t("doctor.licenses.profile.surname")}
            </p>
            <p className="text-lg">{currentWorker.surname}</p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">
              {t("doctor.licenses.profile.specialization")}
            </p>
            <p className="text-lg">
              {currentWorker.specialty?.name} ({currentWorker.specialty?.type})
            </p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">
              {t("doctor.licenses.profile.birthday")}
            </p>
            <p className="text-lg">
              {new Date(currentWorker.birthday).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xl  font-bold text-gray-500">
              {t("doctor.licenses.profile.phone")}
            </p>
            <p className="text-lg">{currentWorker.phone}</p>
          </div>
        
        </div>
      </div>

      {/* Ліцензії */}
      <ListLicensesWorker licenses={licenses} />
    </div>
  );
}
