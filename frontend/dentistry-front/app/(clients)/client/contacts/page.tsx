"use client";
import Link from "next/link";
import DentistryField from "./components/DentistriesField";
import { UseDenormalizeSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { useTranslation } from "react-i18next";

export default function Contacts() {
  const { t } = useTranslation();
  const findedDentistries: IDentistry[] = Object.values(
    UseDenormalizeSelector<IDentistry[]>(
      (state: RootState) => state.findingDentistries,
    ) ?? {},
  );

  return (
    <>
      <div className="relative z-10 pt-10 sm:pt-20 px-4 sm:px-6"></div>
      <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Hero Section */}
        <header className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 drop-shadow-lg">
            {t("client.contacts.contacts")}
          </h1>
          <p className="text-base sm:text-xl text-gray-700 max-w-xl sm:max-w-4xl mx-auto leading-relaxed">
            {t("client.contacts.find_nearest_dentistry")}
          </p>
        </header>
        <DentistryField />

        {/* Dentistry List */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20 w-full items-stretch">
          {findedDentistries.map((dentistry, index) => (
            <div
              key={dentistry.id}
              className="bg-white border border-gray-300 rounded-lg shadow-md p-6 sm:p-8 hover:scale-105 transition-transform"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
                {t("client.contacts.table.dentistry")}: №{index + 1}
              </h3>

              <p className="text-gray-700 text-sm sm:text-base mb-2">
                <strong>{t("client.contacts.table.city")}:</strong>{" "}
                {dentistry.city}
              </p>
              <p className="text-gray-700 text-sm sm:text-base mb-2">
                <strong>{t("client.contacts.table.street")}:</strong>{" "}
                {dentistry.street}
              </p>
              <p className="text-gray-700 text-sm sm:text-base mb-2">
                <strong>{t("client.contacts.table.region")}:</strong>{" "}
                {dentistry.region}
              </p>
            </div>
          ))}
        </section>

        {/* Call to Action */}
        <div className="text-center mb-8 sm:mb-12">
          <Link
            href={"/client/create-appointment"}
            className="bg-yellow-500 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-md hover:bg-yellow-600 transition-colors text-sm sm:text-base"
          >
            {t("client.contacts.make_appointment")}
          </Link>
          <p className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-base max-w-md sm:max-w-2xl mx-auto">
            {t("client.contacts.description_make_appointments")}
          </p>
        </div>
      </div>
    </>
  );
}
