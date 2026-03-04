import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { RootState } from "@/lib/redux/store";
import { ErrorMessage, Field } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ClientField() {
  const { t } = useTranslation();

  const clients = (state: RootState): IClient[] => state.clients;

  const [showClientModal, setShowClientModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<IClient[]>([]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      // виклик API
      fetch(`/api/clients?search=${searchQuery}`);
    } else {
    }
  }, [searchQuery, clients]);

  return (
    <>
      <div className="mx-5 text-gray-500">
        {/* Label окремо */}
        <label className="block mb-1 text-lg text-gray-200">
          {t("Ім’я клієнта")}
        </label>

        {/* Input + Button в одному рядку */}
        <div className="flex items-center gap-2">
          <Field
            id="clientName"
            name="clientName"
            type="text"
            className="flex-1 p-2 text-gray-200 border border-gray-400 placeholder-gray-400 rounded focus:outline-none hover:border-gray-950"
            placeholder={t("Введіть ФІО клієнта")}
          />

          {/* <button
            type="button"
            onClick={() => setShowClientModal(true)}
             className="px-4 py-2 border border-gray-400 text-gray-200 rounded bg-amber-500 transition-all duration-300 hover:bg-amber-600 hover:border-amber-600"
  >
            {t("Пошук")}
          </button> */}
          <button
            type="button"
            onClick={() => setShowClientModal(true)}
            className="px-4 py-2 border border-gray-400 text-gray-200 rounded"
            style={{ backgroundColor: "#8058BF" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#724FAB")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#8058BF")
            }
          >
            {t("Пошук")}
          </button>
        </div>

        <ErrorMessage
          name="clientName"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>

      {showClientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-linear-to-r  from-[#874FD1] to-[#7562A5]  border-2  border-gray-600 rounded-lg shadow-lg p-6 w-2/3 max-w-lg">
            <h3 className="text-lg font-bold mb-4">{t("Пошук клієнта")}</h3>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded mb-4"
              placeholder={t("Введіть ФІО")}
            />

            {/* Dropdown зі списком варіантів */}
            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded">
              {filteredClients.map((client) => (
                <li
                  key={client.id}
                  onClick={() => {
                    // setFieldValue("clientId", client.id);
                    setShowClientModal(false);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {client.name}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setShowClientModal(false)}
              className="mt-4 px-4 py-2 bg-[#7C5CB6] border border-gray-700 text-white rounded hover:bg-purple-700 "
            >
              {t("Закрити")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
