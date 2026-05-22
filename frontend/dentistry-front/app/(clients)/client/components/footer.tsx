"use client";
import { useAppDispatch, UseDenormalizeSelector } from "@/lib/redux/hooks";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { GetDentistriesByCity } from "@/lib/redux/modules/FindingDentistries/actions/GetDentistriesByCity/GetDentistriesByCity";
import { RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ClientFooter() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const dentistry: IDentistry[] = Object.values(
    UseDenormalizeSelector<IDentistry[]>(
      (state: RootState) => state.dentistries,
    ),
  );
  
  // отримання стоматологій по місту
  useEffect(() => {
    if (city) {
      dispatch(GetDentistriesByCity({ city: city.toString() }));
    }
  }, [city]);

  // отримання геолокації
  useEffect(() => {
    const fetchCity = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords;

            // Виклик до API
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            );
            const data = await res.json();

            const foundCity =
              data.address.city || data.address.town || data.address.village;

            // зберігаємо лише після отримання результату
            setCity(foundCity);
          } catch (error) {
            console.error("Помилка при отриманні міста:", error);
          } finally {
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    };

    fetchCity();
  }, []);

  return (
    <>
      <footer className="w-full bg-gray-800 text-gray-200 py-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("client.footer.our_dentistry")}
            </h3>
            <p className="text-sm leading-relaxed">
              {t("client.footer.description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {" "}
              {t("client.footer.navigation")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="hover:text-yellow-400">
                  {t("client.footer.about_us")}
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-yellow-400">
                  {t("client.footer.services")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {" "}
              {t("client.footer.contacts.contacts")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                📍{" "}
                {loading ? (
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded animate-pulse">
                    {t("client.footer.contacts.loading")}
                  </button>
                ) : dentistry.length > 0 ? (
                  (t("client.footer.contacts.city_short"),
                  `${city}, ${dentistry[0].street}`)
                ) : (
                  (t("client.footer.contacts.your_city.in_city"),
                  ` (${city}) `,
                  t("client.footer.contacts.your_city.no_exist_dentistry"))
                )}
              </li>
              <li>📞 +380 (XX) XXX-XX-XX</li>
              <li>✉️ info@stomatology.com</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {" "}
              {t("client.footer.social.we_in_social")}
            </h3>
            <ul className="flex space-x-4 text-sm">
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p> {t("client.footer.devider.defend_rules")}</p>
          <p className="mt-2"> {t("client.footer.devider.wish")} ❤️</p>
        </div>
      </footer>
    </>
  );
}
