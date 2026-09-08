"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ClientMain() {
  const { t } = useTranslation();
  return (
    <>
      <div className="relative z-10 pt-10 sm:pt-20 px-4 sm:px-6"></div>
      <div className="w-full h-full flex flex-col items-center justify-center px-4 sm:px-6">
        {/* Hero Section */}
        <header className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 drop-shadow-lg">
            {t("client.main.text.why_choose_dentistry")}
          </h1>
          <p className="text-base sm:text-xl text-gray-700 max-w-xl sm:max-w-4xl mx-auto leading-relaxed">
            {t("client.main.text.description_reason")}
          </p>
        </header>

        {/* Recommendations Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20 w-full items-stretch">
          <div className="bg-white border border-gray-300 rounded-lg sm:rounded-xl shadow-md sm:shadow-xl p-6 sm:p-8 hover:scale-105 transition-transform">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.main.recomendation.time_saving.title")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.main.recomendation.time_saving.description")}
            </p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg sm:rounded-xl shadow-md sm:shadow-xl p-6 sm:p-8 hover:scale-105 transition-transform">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.main.recomendation.data_security.title")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.main.recomendation.data_security.description")}
            </p>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg sm:rounded-xl shadow-md sm:shadow-xl p-6 sm:p-8 hover:scale-105 transition-transform">
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
              {t("client.main.recomendation.transparent_info.title")}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base">
              {t("client.main.recomendation.transparent_info.description")}
            </p>
          </div>

          {/* Extra cards */}
          <div className="col-span-1 lg:col-span-3 flex flex-col sm:flex-row justify-center gap-6 sm:gap-8">
            <div className="bg-white border border-gray-300 rounded-lg sm:rounded-xl shadow-md sm:shadow-xl p-6 sm:p-8 hover:scale-105 transition-transform">
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
                {t("client.main.recomendation.comfortable_payment.title")}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {t("client.main.recomendation.comfortable_payment.description")}
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg sm:rounded-xl shadow-md sm:shadow-xl p-6 sm:p-8 hover:scale-105 transition-transform">
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-600 mb-3 sm:mb-4">
                {t("client.main.recomendation.care_for_you.title")}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {t("client.main.recomendation.care_for_you.description")}
              </p>
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="text-center max-w-xl sm:max-w-4xl mx-auto mb-12 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4 sm:mb-6">
            {t("client.main.advanteges.title")}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {t("client.main.advanteges.description")}
          </p>
        </section>

        {/* Call to Action */}
        <div className="text-center mb-8 sm:mb-12">
          <Link
            href={"/client/create-appointment"}
            className="bg-yellow-500 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-md sm:shadow-lg hover:bg-yellow-600 transition-colors text-sm sm:text-base"
          >
            {t("client.main.invite.title")}
          </Link>
          <p className="mt-3 sm:mt-4 text-gray-700 text-sm sm:text-base max-w-md sm:max-w-2xl mx-auto">
            {t("client.main.invite.description")}
          </p>
        </div>
      </div>
    </>
  );
}
