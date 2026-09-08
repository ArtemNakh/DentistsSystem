"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, UseDenormalizeSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { useTranslation } from "react-i18next";
import DentistryField from "./components/DentistriesField";
import { GetInfoWorkersByDentistry } from "@/lib/redux/modules/Workers/actions/GetInfoWorkersByDentistry/GetInfoWorkersByDentistry";

export default function DoctorsPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const workers: IWorker[] = Object.values(
    UseDenormalizeSelector<IWorker[]>((state: RootState) => state.workers),
  );

  const [selectedDentistryId, setSelectedDentistryId] = useState<number | null>(
    null,
  );
  const [expandedWorkerIds, setExpandedWorkerIds] = useState<number[]>([]);

  const toggleWorkerLicenses = (workerId: number) => {
    setExpandedWorkerIds(
      (prev) =>
        prev.includes(workerId)
          ? prev.filter((id) => id !== workerId) // якщо вже відкритий — закриваємо
          : [...prev, workerId], // якщо закритий — додаємо
    );
  };

  useEffect(() => {
    if (selectedDentistryId) {
      dispatch(GetInfoWorkersByDentistry({ idDentistry: selectedDentistryId }));
    }
  }, [dispatch, selectedDentistryId]);

  return (
    <div className="w-full h-full flex flex-col items-center px-4 sm:px-6 py-8">
      <header className="text-center mb-10 sm:mb-16">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 drop-shadow-lg">
          {t("client.doctors.title")}
        </h1>
        <p className="text-base sm:text-xl text-gray-700 max-w-xl sm:max-w-4xl mx-auto leading-relaxed">
          {t("client.doctors.choose_dentistry")}
        </p>
      </header>

      <DentistryField
        onDentistrySelected={(id: number) => setSelectedDentistryId(id)}
      />

      {selectedDentistryId && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-10 w-full items-start ">
          {workers.map((worker) => (
            <div
              key={worker.id}
              className="bg-gray-100 border shadow-gray-400 border-gray-300 rounded-lg shadow-md p-5 sm:p-8 hover:scale-105 transition-transform"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
                {worker.surname} {worker.name} {worker.middle_name}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base mb-2">
                <strong>{t("client.doctors.specialty")}:</strong>{" "}
                {worker.specialty?.name}
              </p>

              <button
                onClick={() => toggleWorkerLicenses(worker.id)}
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition-colors"
              >
                {expandedWorkerIds.includes(worker.id)
                  ? t("client.doctors.hide_licenses")
                  : t("client.doctors.show_licenses")}
              </button>

              {expandedWorkerIds.includes(worker.id) && worker.licenses && (
                <ul className=" mt-4  border-t border-gray-200 pt-4 space-y-3">
                  {worker.licenses.map((lic) => (
                    <li
                      key={lic.id}
                      className="p-3 bg-gray-50 rounded-md shadow-sm border border-gray-300 shadow-gray-400"
                    >
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        {lic.issued_by}
                      </h4>
                      <p className="text-sm text-gray-700">
                        <strong>{t("client.doctors.issue_date")}:</strong>{" "}
                        {new Date(lic.issue_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>{t("client.doctors.expiration")}:</strong>{" "}
                        {new Date(lic.expiration_date).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
