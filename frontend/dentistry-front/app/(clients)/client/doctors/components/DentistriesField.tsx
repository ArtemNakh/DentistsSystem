// DentistryField.tsx
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { GetDentistriesByCity } from "@/lib/redux/modules/FindingDentistries/actions/GetDentistriesByCity/GetDentistriesByCity";

interface DentistryFieldProps {
  onDentistrySelected?: (id: number) => void;
}

export default function DentistryField({
  onDentistrySelected,
}: DentistryFieldProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
  }, [searchQuery]); // прибери dentistries

  return (
    <>
      <div className="w-full max-w-md mx-auto sm:max-w-2xl">
        <label className="block mb-2 text-base sm:text-xl font-semibold text-gray-900">
          {t("client.doctors.dentistry_field.label")}
        </label>

        <div className="flex items-center gap-2 sm:gap-4">
          <input
            id="dentistryName"
            value={selectedDentistryName || ""}
            readOnly
            type="text"
            className="flex-1 p-2 sm:p-3 text-gray-900 border border-gray-300 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
            placeholder={t(
              "client.doctors.dentistry_field.placeholder_selected_city",
            )}
          />
          <button
            type="button"
            onClick={() => setShowDentistryModal(true)}
            className="px-4 sm:px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-transform hover:scale-105 text-sm sm:text-base"
            style={{ background: "linear-gradient(90deg,#FACC15,#EAB308)" }}
          >
            {t("client.doctors.dentistry_field.find_button")}
          </button>
        </div>

        {showDentistryModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 w-11/12 sm:w-2/3 max-w-sm sm:max-w-lg animate-fadeIn">
              <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-yellow-600 text-center">
                {t("client.doctors.dentistry_field.modal_title")}
              </h3>

              <div className="relative mb-4 sm:mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 sm:p-3 pl-8 sm:pl-10 border border-gray-300 text-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
                  placeholder={t(
                    "client.doctors.dentistry_field.search_placeholder",
                  )}
                />
                <span className="absolute left-2 sm:left-3 top-2 sm:top-3 text-gray-400">
                  🔍
                </span>
              </div>

              <ul className="max-h-48 sm:max-h-56 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm sm:text-base">
                {filteredDentistries.map((dentistry) => (
                  <li
                    key={dentistry.id}
                    onClick={() => {
                      setSelectedDentistryName(
                        `${dentistry.city}, ${dentistry.street} (${dentistry.region})`,
                      );
                      setShowDentistryModal(false);
                      if (onDentistrySelected) {
                        onDentistrySelected(dentistry.id);
                      }
                    }}
                    className="p-2 sm:p-3 cursor-pointer hover:bg-yellow-50 transition-colors"
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
                className="mt-4 sm:mt-6 w-full px-4 sm:px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-transform hover:scale-105 text-sm sm:text-base"
                style={{ background: "linear-gradient(90deg,#FACC15,#CA8A04)" }}
              >
                {t("client.doctors.dentistry_field.close_button")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
