import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";

import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { GetDentistriesByCity } from "@/lib/redux/modules/FindingDentistries/actions/GetDentistriesByCity/GetDentistriesByCity";

export default function DentistryField() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setFieldValue } = useFormikContext<any>();

  const dentistries: IDentistry[] = Object.values(
    useAppSelector((state: RootState) => state.findingDentistries),
  );

  const [showDentistryModal, setShowDentistryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDentistries, setFilteredDentistries] = useState<IDentistry[]>(
    [],
  );
  const [selectedDentistryName, setSelectedDentistryName] = useState("");

  useEffect(() => {
    if (searchQuery.length > 2) {
      dispatch(GetDentistriesByCity({ city: searchQuery }));
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setFilteredDentistries(dentistries);
    } else {
      setFilteredDentistries([]);
    }
  }, [searchQuery]);

  return (
    <>
      <div className="mx-3 sm:mx-5 text-gray-700 w-full">
        <label className="block mb-2 text-base sm:text-lg font-semibold text-gray-900">
          {t("client.create_appointment.dentistry.title")}
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Field
            id="dentistryName"
            name="dentistryName"
            value={selectedDentistryName || ""}
            readOnly
            type="text"
            className="flex-1 p-3 text-gray-900 border border-gray-300 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
            placeholder={t(
              "client.create_appointment.dentistry.placeholder_city_name",
            )}
          />
          <Field type="hidden" name="dentistryId" />
          <button
            type="button"
            onClick={() => setShowDentistryModal(true)}
            className="px-4 sm:mr-3 sm:px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200 shadow-md text-sm sm:text-base  bg-linear-to-r from-yellow-400 to-yellow-500
    hover:from-yellow-500 hover:to-yellow-600
    active:from-yellow-600 active:to-yellow-700 "
          >
            {t("client.create_appointment.dentistry.find")}
          </button>
        </div>

        <ErrorMessage
          name="dentistryName"
          component="div"
          className="mt-1 text-red-500 text-xs sm:text-sm"
        />
      </div>

      {showDentistryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-full sm:w-2/3 max-w-lg animate-fadeIn">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-yellow-600 text-center sm:text-left">
              {t("client.create_appointment.dentistry.find_dentistry")}
            </h3>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
                placeholder={t(
                  "client.create_appointment.dentistry.placeholder_enter_city_name",
                )}
              />
              <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            </div>

            <ul className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {filteredDentistries.map((dentistry) => (
                <li
                  key={dentistry.id}
                  onClick={() => {
                    setFieldValue("dentistryId", dentistry.id);
                    setSelectedDentistryName(
                      `${dentistry.city}, ${dentistry.street} (${dentistry.region})`,
                    );
                    setShowDentistryModal(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-yellow-50 transition-colors text-sm sm:text-base"
                >
                  <span className="font-medium text-gray-900">
                    {dentistry.city}, {dentistry.street}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    {" "}
                    ({dentistry.region})
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowDentistryModal(false)}
              className="mt-6 w-full sm:w-auto px-4 sm:px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200 shadow-md text-sm sm:text-base  bg-linear-to-r from-yellow-400 to-yellow-500
    hover:from-yellow-500 hover:to-yellow-600
    active:from-yellow-600 active:to-yellow-700"
            >
              {t("client.create_appointment.dentistry.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
