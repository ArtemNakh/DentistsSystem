"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { GetDentistriesByCity } from "@/lib/redux/modules/FindingDentistries/actions/GetDentistriesByCity/GetDentistriesByCity";

export default function DentistryField() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery.length > 2) {
      dispatch(GetDentistriesByCity({ city: searchQuery }));
    }
  }, [searchQuery]);

  return (
    <>
      <div className="w-full max-w-xl mx-auto mb-8">
        <label className="block mb-2 text-lg font-semibold text-gray-800">
          {t("client.contacts.dentistry.dentistry")}
        </label>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-center flex-1 p-3 text-gray-900 border border-gray-300 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder=   {t("client.contacts.dentistry.placeholder_find")}
          />
        </div>
      </div>
    </>
  );
}
