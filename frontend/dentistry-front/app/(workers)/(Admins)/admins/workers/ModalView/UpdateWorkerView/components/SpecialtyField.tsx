
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { GetSpecialtiesByName } from "@/lib/redux/modules/Specialties/Entities/FindedSpecialties/actions/GetSpecialtiesByFIO/GetSpecialtiesByFIO";

import { ISpecialty } from "@/lib/redux/modules/Specialties/Entities/Specialties/Specialties.interface";
import { RootState } from "@/lib/redux/store";
import { Field, useFormikContext } from "formik";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function SpecialtyField() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { setFieldValue } = useFormikContext<any>();

  const specialties = useAppSelector(
    (state: RootState) => state.findingSpecialties,
  );

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpecialties, setFilteredSpecialties] = useState<ISpecialty[]>(
    [],
  );
  const [selectedSpecialtyName, setSelectedSpecialtyName] = useState("");

  useEffect(() => {
    if (searchQuery.length > 2) {
      dispatch(GetSpecialtiesByName({ name: searchQuery }));
    }
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setFilteredSpecialties(Object.values(specialties));
    } else {
      setFilteredSpecialties([]);
    }
  }, [searchQuery, specialties]);

  return (
    <div className="w-full  mb-2  text-gray-500">
      <label className="block text-lg text-gray-700">
        {t("admins.workers.update_worker.find_specialization.specialization")}
      </label>

      <div className="flex items-center gap-2">
        <Field
          id="specialtyName"
          name="specialtyName"
          value={selectedSpecialtyName}
          readOnly
          type="text"
          className="flex-1 p-2 border border-gray-400 rounded"
          placeholder={t(
            "admins.workers.update_worker.find_specialization.enter_name_specialization",
          )}
        />
        {/* приховане поле для ID */}
        <Field type="hidden" name="specialtyId" />
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 border rounded hover:bg-[#674F96] bg-[#7A5EB2] text-white"
        >
          {t("admins.workers.update_worker.find_specialization.find")}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-2/3 max-w-lg">
            <h3 className="text-lg font-bold mb-4">
              {t(
                "admins.workers.update_worker.find_specialization.find_specialization",
              )}
            </h3>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder={t(
                "admins.workers.update_worker.find_specialization.enter_name",
              )}
            />

            <ul className="max-h-40 overflow-y-auto border rounded">
              {filteredSpecialties.map((s) => (
                <li
                  key={s.id}
                  onClick={() => {
                    setFieldValue("specialtyId", s.id);
                    setSelectedSpecialtyName(s.name);
                    setShowModal(false);
                  }}
                  className="p-2 hover:bg-purple-200 cursor-pointer"
                >
                  {s.name}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 text-gray-200 hover:bg-[#674F96] bg-[#7A5EB2] rounded"
            >
              {t("admins.workers.update_worker.find_specialization.close")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
