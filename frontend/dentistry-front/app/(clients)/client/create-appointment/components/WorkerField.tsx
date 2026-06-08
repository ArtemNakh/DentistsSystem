import { UseDenormalizeSelector } from "@/lib/redux/hooks";
import { GetAppointmentsByWorkerNext3Month } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByWorkerNext3Month/GetAppointmentsByWorkerNext3Month";
import { GetWorkersByFullName } from "@/lib/redux/modules/FindingWorkers/actions/GetWorkersByFIO/GetWorkersByFIO";
import { SpecialtyType } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";

import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { getShiftsWorker } from "@/lib/redux/modules/WorkerShifts/actions/GetShiftsToWorker/GetShiftsToWorker";
import { RootState } from "@/lib/redux/store";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

export default function WorkerField() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  let workers = Object.values(
    UseDenormalizeSelector<IWorker[]>(
      (state: RootState) => state.findingWorkers,
    ),
  ).filter((worker) => worker.specialty?.type == SpecialtyType.DOCTOR);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState<IWorker[]>([]);
  const [selectedWorkerName, setSelectedWorkerName] = useState("");
  const { setFieldValue, values } = useFormikContext<any>();
  useEffect(() => {
    if (values.dentistryId) {
      dispatch(
        GetWorkersByFullName({
          fullName: "", // пустий запит → всі працівники
          dentistryId: values.dentistryId,
        }),
      );
    }
  }, [values.dentistryId, dispatch]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setFilteredWorkers(
        workers.filter((w) =>
          `${w.surname} ${w.name} ${w.middle_name ?? ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setFilteredWorkers([]);
    }
  }, [searchQuery]);
  return (
    <>
      <div className="mx-3 sm:mx-5 text-gray-700 w-full">
        <label className="block mb-2 text-base sm:text-lg font-semibold text-gray-900">
          {t("client.create_appointment.worker.name_worker")}
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Field
            id="workerName"
            name="workerName"
            value={selectedWorkerName}
            readOnly
            type="text"
            className="flex-1 p-3 text-gray-900 border border-gray-300 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
            placeholder={t("client.create_appointment.worker.fio_worker")}
          />
          <Field type="hidden" name="dentistId" />
          <button
            type="button"
            onClick={() => setShowWorkerModal(true)}
            className="px-4 sm:mr-3 sm:px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200 shadow-md text-sm sm:text-base  bg-linear-to-r from-yellow-400 to-yellow-500
    hover:from-yellow-500 hover:to-yellow-600
    active:from-yellow-600 active:to-yellow-700"
          >
            {t("client.create_appointment.worker.find")}
          </button>
        </div>

        <ErrorMessage
          name="workerName"
          component="div"
          className="mt-1 text-red-500 text-xs sm:text-sm"
        />
      </div>

      {showWorkerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full sm:w-2/3 max-w-lg animate-fadeIn">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-600 text-center sm:text-left">
              {t("client.create_appointment.worker.find_worker")}
            </h3>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 text-gray-700 placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
                placeholder={t("client.create_appointment.worker.enter_fio")}
              />
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>

            {/* ✅ Список результатів пошуку */}
            {searchQuery.length > 2 && filteredWorkers.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  {t("client.create_appointment.worker.search_results")}
                </h4>
                <ul className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 mb-4">
                  {filteredWorkers.map((worker) => (
                    <li
                      key={worker.id}
                      onClick={() => {
                        setFieldValue("dentistId", worker.id);
                        setSelectedWorkerName(
                          `${worker.surname} ${worker.name} ${worker.middle_name ?? ""} — ${worker.specialty?.name ?? ""} (${new Date(worker.birthday).getFullYear()})`,
                        );
                        dispatch(getShiftsWorker({ idWorker: worker.id }));
                        dispatch(
                          GetAppointmentsByWorkerNext3Month({
                            workerId: worker.id,
                          }),
                        );
                        setShowWorkerModal(false);
                      }}
                      className="p-3 cursor-pointer hover:bg-yellow-50 transition-colors text-sm sm:text-base"
                    >
                      <span className="font-medium text-gray-900">
                        {worker.surname} {worker.name} {worker.middle_name}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">
                        ({worker.specialty?.name}) (
                        {new Date(worker.birthday).getFullYear()})
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* ✅ Список усіх працівників стоматології */}
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              {t("client.create_appointment.worker.all_workers")}
            </h4>
            <ul className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {workers.map((worker) => (
                <li
                  key={worker.id}
                  onClick={() => {
                    setFieldValue("dentistId", worker.id);
                    setSelectedWorkerName(
                      `${worker.surname} ${worker.name} ${worker.middle_name ?? ""} — ${worker.specialty?.name ?? ""} (${new Date(worker.birthday).getFullYear()})`,
                    );
                    dispatch(getShiftsWorker({ idWorker: worker.id }));
                    dispatch(
                      GetAppointmentsByWorkerNext3Month({
                        workerId: worker.id,
                      }),
                    );
                    setShowWorkerModal(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-yellow-50 transition-colors text-sm sm:text-base"
                >
                  <span className="font-medium text-gray-900">
                    {worker.surname} {worker.name} {worker.middle_name}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    ({worker.specialty?.name}) (
                    {new Date(worker.birthday).getFullYear()})
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowWorkerModal(false)}
              className="mt-6 w-full sm:w-auto px-4 sm:px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200 shadow-md text-sm sm:text-base bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 active:from-yellow-600 active:to-yellow-700"
            >
              {t("client.create_appointment.worker.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
