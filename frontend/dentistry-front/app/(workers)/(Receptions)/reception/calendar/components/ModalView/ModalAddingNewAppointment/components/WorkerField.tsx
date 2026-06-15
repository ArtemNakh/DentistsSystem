import { useAppSelector, UseDenormalizeSelector } from "@/lib/redux/hooks";
import { GetAppointmentsByWorkerNext3Month } from "@/lib/redux/modules/Appointments/actions/GetAppointmentsByWorkerNext3Month/GetAppointmentsByWorkerNext3Month";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { GetWorkersByFullName } from "@/lib/redux/modules/FindingWorkers/actions/GetWorkersByFIO/GetWorkersByFIO";
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

  const { setFieldValue } = useFormikContext<any>();
  let workers = Object.values(
    UseDenormalizeSelector<IWorker[]>(
      (state: RootState) => state.findingWorkers,
    ),
  );

  const authUser: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState<IWorker[]>([]);
  const [selectedWorkerName, setSelectedWorkerName] = useState("");

  useEffect(() => {
    if (authUser?.dentistry?.id) {
      dispatch(
        GetWorkersByFullName({
          fullName: "",
          dentistryId: authUser.dentistry.id,
        }),
      );
    }
  }, [dispatch, authUser]);

  useEffect(() => {
    if (searchQuery.length > 0) {

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

  // Фільтрація працівників щоб введене значення співпадало із ФІО
  useEffect(() => {
    if (searchQuery.length > 0) {
      const arr = Array.isArray(workers)
        ? workers
        : (Object.values(workers || {}) as IWorker[]);
      const q = searchQuery.toLowerCase();

      const filtered = arr.filter((w: IWorker) => {
        return (
          w.name?.toLowerCase().includes(q) ||
          w.surname?.toLowerCase().includes(q) ||
          w.middle_name?.toLowerCase().includes(q) ||
          `${w.surname} ${w.name} ${w.middle_name ?? ""}`
            .toLowerCase()
            .includes(q)
        );
      });

      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers([]);
    }
  }, [searchQuery]);

  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-200">
          {t("reception.calendar.modal.adding_appointment.worker.title")}
        </label>

        <div className="flex items-center gap-2">
          <Field
            id="workerName"
            name="workerName"
            value={selectedWorkerName}
            readOnly
            type="text"
            className="flex-1 p-2 text-gray-200 border border-gray-400 placeholder-gray-400 rounded focus:outline-none hover:border-gray-950"
            placeholder={t(
              "reception.calendar.modal.adding_appointment.worker.placeholder",
            )}
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
            {t("reception.calendar.modal.adding_appointment.worker.find")}
          </button>
        </div>

        <ErrorMessage
          name="dentistId"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>

      {showWorkerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] border-2 border-gray-600 rounded-lg shadow-lg p-6 w-2/3 max-w-lg">
            <h3 className="text-lg font-bold mb-4">
              {t(
                "reception.calendar.modal.adding_appointment.worker.find_worker",
              )}
            </h3>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded mb-4"
              placeholder={t(
                "reception.calendar.modal.adding_appointment.worker.enter_fio",
              )}
            />

            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded">
              {(searchQuery.trim() === "" ? workers : filteredWorkers).map(
                (worker) => (
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
              {t("reception.calendar.modal.adding_appointment.worker.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
