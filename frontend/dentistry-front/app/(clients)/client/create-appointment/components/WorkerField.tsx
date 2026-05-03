import { useAppSelector } from "@/lib/redux/hooks";
import { GetAppointmentsByWorkerNext3Month } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByWorkerNext3Month/GetAppointmentsByWorkerNext3Month";
import { GetClientsByFullName } from "@/lib/redux/modules/Clients/actions/GetClientsByFullName/GetClientsByFullName";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { GetWorkersByFullName } from "@/lib/redux/modules/FindingWorkers/actions/GetWorkersByFIO/GetWorkersByFIO";
import { ISpecialty } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { getShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/GetShiftsToWorker/GetShiftsToWorker";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { denormalize, schema } from "normalizr";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export const DenormalizeWorkers = createSelector(
  [
    (state: RootState) => state.findingWorkers,
    (state: RootState) => state.dentistries,
    (state: RootState) => state.specialties,
  ],
  (workersObj, dentistriesObj, specialtiesObj) => {
    const workers: IWorker[] = Object.values(workersObj ?? {});
    const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
    const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});

    return workers.map((w) => {
      const dentistry = dentistries.find((d) => d.id === (w.dentistry as any));
      const specialty = specialties.find((s) => s.id === (w.specialty as any));

      return { ...w, dentistry: dentistry!, specialty: specialty! };
    });
  },
);

export default function WorkerField() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  let workers = useAppSelector(DenormalizeWorkers); //useSelector((state: RootState) => state.findingWorkers);

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState<IWorker[]>([]);
  const [selectedWorkerName, setSelectedWorkerName] = useState(""); // локальний стан для відображення
  const { setFieldValue, values } = useFormikContext<any>();

  useEffect(() => {
    if (searchQuery.length > 2) {
      console.log("seatck", searchQuery);
      dispatch(
        GetWorkersByFullName({
          fullName: searchQuery,
          dentistryId: values.dentistryId, // <-- додаємо ID клініки
        }),
      );
    }
  }, [searchQuery, values.dentistryId, dispatch]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setFilteredWorkers(workers);
    } else {
      setFilteredWorkers([]);
    }
  }, [searchQuery, workers]);

  useEffect(() => {
    console.log("workers from store:", workers);
  }, [workers]);
  return (
    <>
      <div className="mx-5 text-gray-700">
        <label className="block mb-2 text-lg font-semibold text-gray-800">
          {t("Ім’я працівника")}
        </label>

        <div className="flex items-center  gap-3">
          <Field
            id="workerName"
            name="workerName"
            value={selectedWorkerName}
            readOnly
            type="text"
            className="flex-1 p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t("Введіть ФІО працівника")}
          />
          <Field type="hidden" name="dentistId" />
          <button
            type="button"
            onClick={() => setShowWorkerModal(true)}
            className="px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200"
            style={{ background: "linear-gradient(90deg,#8058BF,#6A4AA3)" }}
          >
            {t("Пошук")}
          </button>
        </div>

        <ErrorMessage
          name="workerName"
          component="div"
          className="mt-1 text-red-500 text-sm"
        />
      </div>

      {showWorkerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-2/3 max-w-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-purple-700">
              {t("Пошук працівника")}
            </h3>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 text-gray-600  placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("Введіть ФІО")}
              />
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>

            <ul className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {filteredWorkers.map((worker) => (
                <li
                  key={worker.id}
                  onClick={() => {
                    setFieldValue("dentistId", worker.id);
                    setSelectedWorkerName(
                      `${worker.surname} ${worker.name} ${worker.middle_name ?? ""} — ${worker.specialty?.name ?? ""} (${new Date(worker.birthday).getFullYear()})`,
                    );
                    dispatch(getShiftsWorker({ idWorker: worker.id }));
                    dispatch(GetAppointmentsByWorkerNext3Month({ workerId: worker.id }));
                    setShowWorkerModal(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-purple-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">
                    {worker.surname} {worker.name} {worker.middle_name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {" "}
                    ({worker.specialty?.name}) (
                    {new Date(worker.birthday).getFullYear()})
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowWorkerModal(false)}
              className="mt-6 px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200"
              style={{ background: "linear-gradient(90deg,#7C5CB6,#5E3F94)" }}
            >
              {t("Закрити")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
