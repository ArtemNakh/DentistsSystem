import { GetClientsByFullName } from "@/lib/redux/modules/Clients/actions/GetClientsByFullName/GetClientsByFullName";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { RootState } from "@/lib/redux/store";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

export default function ClientField() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { setFieldValue } = useFormikContext<any>();
  let clients = useSelector((state: RootState) => state.clients);

  const [showClientModal, setShowClientModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredClients, setFilteredClients] = useState<IClient[]>([]);
  const [selectedClientName, setSelectedClientName] = useState("");
  
  // Отримання клієнта по ФІО
  useEffect(() => {
    if (searchQuery.length > 2) {
      dispatch(GetClientsByFullName({ fullName: searchQuery, }));
    }
  }, [searchQuery, dispatch]);


  // Фільтрація клієнтів щоб введене значення співпадало із ФІО
  useEffect(() => {
    if (searchQuery.length > 2) {
      const arr = Array.isArray(clients)
        ? clients
        : Object.values(clients || {});

      const filtered = arr.filter((c: IClient) => {
        const q = searchQuery.toLowerCase();

        return (
          c.name?.toLowerCase().includes(q) ||
          c.surname?.toLowerCase().includes(q) ||
          c.middle_name?.toLowerCase().includes(q) ||
          `${c.surname} ${c.name} ${c.middle_name ?? ""}`
            .toLowerCase()
            .includes(q)
        );
      });

      setFilteredClients(filtered);
    } else {
      setFilteredClients([]);
    }
  }, [searchQuery, clients]);

  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-200">
          {t("reception.calendar.modal.adding_appointment.client.title")}
        </label>

        <div className="flex items-center gap-2">
          <Field
            id="clientName"
            name="clientName"
            value={selectedClientName}
            readOnly
            type="text"
            className="flex-1 p-2 text-gray-200 border border-gray-400 placeholder-gray-400 rounded focus:outline-none hover:border-gray-950"
            placeholder={t(
              "reception.calendar.modal.adding_appointment.client.placeholder",
            )}
          />
          {/* Приховане поле для ID у Formik */}
          <Field type="hidden" name="clientId" />
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
            {t("reception.calendar.modal.adding_appointment.client.find")}
          </button>
        </div>

       <ErrorMessage
  name="clientId"
  component="div"
  className="text-red-500 text-lg"
/>

      </div>

      {showClientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] border-2 border-gray-600 rounded-lg shadow-lg p-6 w-2/3 max-w-lg">
            <h3 className="text-lg font-bold mb-4">
              {t(
                "reception.calendar.modal.adding_appointment.client.find_client",
              )}
            </h3>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded mb-4"
              placeholder={t(
                "reception.calendar.modal.adding_appointment.client.enter_fio",
              )}
            />

            <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded">
              {(Array.isArray(filteredClients) ? filteredClients : []).map(
                (client) => (
                  <li
                    key={client.id}
                    onClick={() => {
                      setFieldValue("clientId", client.id); // у Formik зберігається ID
                      setSelectedClientName(
                        `${client.surname} ${client.name} ${client.middle_name ?? ""} ${new Date(client.birthdate).getFullYear()}`,
                      ); // у полі показується ПІБ + рік
                      setShowClientModal(false);
                    }}
                    className="p-2 hover:bg-[#793fc6] cursor-pointer"
                  >
                    {client.surname} {client.name} {client.middle_name} (
                    {new Date(client.birthdate).getFullYear()})
                  </li>
                ),
              )}
            </ul>

            <button
              onClick={() => setShowClientModal(false)}
              className="mt-4 px-4 py-2 bg-[#7C5CB6] border border-gray-700 text-white rounded hover:bg-purple-700"
            >
              {t("reception.calendar.modal.adding_appointment.client.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
