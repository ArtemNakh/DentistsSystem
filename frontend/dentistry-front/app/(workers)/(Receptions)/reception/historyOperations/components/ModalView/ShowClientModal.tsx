import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { useTranslation } from "react-i18next";

interface ShowClientModalProps {
  client: IClient;
  setClient: (client: IClient | null) => void;
}

export default function ShowClientModal({
  client,
  setClient,
}: ShowClientModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white border border-[#6f3aaf] rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-[#6f3aaf] mb-4 text-center">
          {t("reception.history_operation.table.body.client.modal.title")}
        </h2>

        <div className="grid grid-cols-1 gap-3 text-gray-700 text-sm">
        
          <div>
            <span className="font-medium text-[#6f3aaf]">
              {t("reception.history_operation.table.body.client.modal.name")}:
            </span>
            {client.name}
          </div>
          <div>
            <span className="font-medium text-[#6f3aaf]">
              {t("reception.history_operation.table.body.client.modal.surname")}:
            </span>{" "}
            {client.surname}
          </div>
          {client.middle_name && (
            <div>
              <span className="font-medium text-[#6f3aaf]">
                {t("reception.history_operation.table.body.client.modal.middle_name")}:
              </span>{" "}
              {client.middle_name}
            </div>
          )}
          <div>
            <span className="font-medium text-[#6f3aaf]">
              {t("reception.history_operation.table.body.client.modal.birthdate")}:
            </span>{" "}
            {client.birthdate}
          </div>
          <div>
            <span className="font-medium text-[#6f3aaf]">
              {t("reception.history_operation.table.body.client.modal.blood_group")}:
            </span>{" "}
            {client.blood_group}
          </div>
          <div>
            <span className="font-medium text-[#6f3aaf]">
              {t("reception.history_operation.table.body.client.modal.rh_factor")}:
            </span>{" "}
            {client.blood_resus === "plus" ? "+" : "-"}
          </div>
          <div>
            <span className="font-medium text-[#6f3aaf]">
              {t("reception.history_operation.table.body.client.modal.phone")}:
            </span>{" "}
            {client.phone}
          </div>
          {client.allergic_diseases && (
            <div>
              <span className="font-medium text-[#6f3aaf]">
                {t("reception.history_operation.table.body.client.modal.allergies")}:
              </span>{" "}
              {client.allergic_diseases}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => setClient(null)}
            className="px-4 py-2 bg-[#6f3aaf] text-white rounded hover:bg-[#7946b7] transition"
          >
            {t("reception.history_operation.table.body.client.modal.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
