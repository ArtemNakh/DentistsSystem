import { useAppSelector } from "@/lib/redux/hooks";
import { GetAppointmentsByWorkerNext3Month } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByWorkerNext3Month/GetAppointmentsByWorkerNext3Month";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
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
import { useDispatch } from "react-redux";

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

  const { setFieldValue } = useFormikContext<any>();
  let workers = useAppSelector(DenormalizeWorkers); //useSelector((state: RootState) => state.findingWorkers);

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState<IWorker[]>([]);
  const [selectedWorkerName, setSelectedWorkerName] = useState(""); // локальний стан для відображення
  const authUser = useAppSelector((state: AuthState) => state.user);
  useEffect(() => {
    if (searchQuery.length > 2 && authUser?.dentistry?.id) {
      dispatch(
        GetWorkersByFullName({
          fullName: searchQuery,
          dentistryId: authUser.dentistry.id,
        }),
      );
    }
  }, [searchQuery, dispatch, authUser]);

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
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-200">
          {t("Ім’я працівника")}
        </label>

        <div className="flex items-center gap-2">
          <Field
            id="workerName"
            name="workerName"
            value={selectedWorkerName}
            readOnly
            type="text"
            className="flex-1 p-2 text-gray-200 border border-gray-400 placeholder-gray-400 rounded focus:outline-none hover:border-gray-950"
            placeholder={t("Введіть ФІО працівника")}
          />
          {/* Приховане поле для ID у Formik */}
          <Field type="hidden" name="dentistId" />
          <button
            type="button"
            onClick={() => setShowWorkerModal(true)}
            className="px-4 py-2 border border-gray-400 text-gray-200 rounded"
            style={{ backgroundColor: "#8058BF" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#724FAB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#8058BF")
            }
          >
            {t("Пошук")}
          </button>
        </div>

        <ErrorMessage
          name="workerName"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>

      {showWorkerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] border-2 border-gray-600 rounded-lg shadow-lg p-6 w-2/3 max-w-lg">
            <h3 className="text-lg font-bold mb-4">{t("Пошук працівника")}</h3>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded mb-4"
              placeholder={t("Введіть ФІО")}
            />

            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded">
              {(Array.isArray(filteredWorkers) ? filteredWorkers : []).map(
                (worker) => (
                  <li
                    key={worker.id}
                    onClick={() => {
                      // зберігаємо ID у Formik
                      setFieldValue("dentistId", worker.id);

                      // показуємо ім’я у полі
                      setSelectedWorkerName(
                        `${worker.surname} ${worker.name} ${worker.middle_name ?? ""} — ${worker.specialty?.name ?? ""} (${new Date(worker.birthday).getFullYear()})`,
                      );

                      // робимо запити до БД через Redux Saga
                      dispatch(getShiftsWorker({ idWorker: worker.id }));
                      dispatch(
                        GetAppointmentsByWorkerNext3Month({ workerId: worker.id }),
                      );

                      setShowWorkerModal(false);
                    }}
                    className="p-2 hover:bg-[#7551B0] cursor-pointer"
                  >
                    {worker.surname} {worker.name} {worker.middle_name} (
                    {worker.specialty?.name}) (
                    {new Date(worker.birthday).getFullYear()})
                  </li>
                ),
              )}
            </ul>

            <button
              onClick={() => setShowWorkerModal(false)}
              className="mt-4 px-4 py-2 bg-[#7C5CB6] border border-gray-700 text-white rounded hover:bg-purple-700"
            >
              {t("Закрити")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
