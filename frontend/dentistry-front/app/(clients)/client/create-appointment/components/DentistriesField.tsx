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

  const dentistries: IDentistry[] = useAppSelector((state: RootState) =>
    Object.values(state.findingDentistries ?? {}),
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
    console.log("qwe", dentistries);
    if (searchQuery.length > 2) {
      setFilteredDentistries(dentistries);
    } else {
      setFilteredDentistries([]);
    }
  }, [searchQuery]); // <-- тут кожна зміна dentistries викликає setState

  return (
    <>
      <div className="mx-5 text-gray-700">
        <label className="block mb-2 text-lg font-semibold text-gray-800">
          {t("Стоматологія")}
        </label>

        <div className="flex items-center gap-3">
          <Field
            id="dentistryName"
            name="dentistryName"
           value={selectedDentistryName || ""}

            readOnly
            type="text"
            className="flex-1 p-3 text-gray-900 border border-gray-300 rounded-lg shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t("Введіть назву/місто клініки")}
          />
          <Field type="hidden" name="dentistryId" />
          <button
            type="button"
            onClick={() => setShowDentistryModal(true)}
            className="px-5 py-2 rounded-lg font-medium text-white transition-colors duration-200"
            style={{ background: "linear-gradient(90deg,#8058BF,#6A4AA3)" }}
          >
            {t("Пошук")}
          </button>
        </div>

        <ErrorMessage
          name="dentistryName"
          component="div"
          className="mt-1 text-red-500 text-sm"
        />
      </div>

      {showDentistryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-2/3 max-w-lg animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-purple-700">
              {t("Пошук клініки")}
            </h3>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 text-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("Введіть місто або адресу")}
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
                  className="p-3 cursor-pointer hover:bg-purple-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">
                    {dentistry.city}, {dentistry.street}
                  </span>
                  <span className="text-sm text-gray-500">
                    {" "}
                    ({dentistry.region})
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowDentistryModal(false)}
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
