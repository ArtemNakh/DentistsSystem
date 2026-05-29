"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function AboutUs() {
  const { t } = useTranslation();
  return (
    <>
      <div className="relative z-10 pt-10 sm:pt-20 px-4 sm:px-6"></div>
      <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Hero Section */}
        <header className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 drop-shadow-lg">
            {t("client.about_us.text.about")}
          </h1>
          <p className="text-base sm:text-xl text-gray-700 max-w-xl sm:max-w-4xl mx-auto leading-relaxed">
            {t("client.about_us.text.description_about_us")}
          </p>
        </header>

        {/* Mission & Values */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-20 w-full items-stretch">
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 sm:p-8 hover:scale-105 transition-transform">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.about_us.text.our_mission")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.about_us.text.description_our_mission")}
            </p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 sm:p-8 hover:scale-105 transition-transform">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.about_us.text.our_values")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.about_us.text.description_our_values")}
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="text-center max-w-xl sm:max-w-4xl mx-auto mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
            {t("client.about_us.text.our_services")}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {t("client.about_us.text.description_our_services")}
          </p>
        </section>

        {/* Team */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20 w-full items-stretch">
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.about_us.team.expierence")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.about_us.team.description_expierence")}
            </p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.about_us.team.professionalizm")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.about_us.team.description_professionalizm")}
            </p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.about_us.team.care")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.about_us.team.description_care")}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
