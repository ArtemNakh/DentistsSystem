import { useTranslation } from "react-i18next";

export default function TableHeaderHistoryAppointment() {
  const { t } = useTranslation();
  return (
    <>
      <thead className="">
        <tr>
          <th className="border border-gray-400 px-2 py-1 text-base">
            {t("doctor.history_operation.table.header.client")}
          </th>
          <th className="border border-gray-400 px-2 py-1 text-base">
            {t("doctor.history_operation.table.header.operation_date")}
          </th>
          <th className="border border-gray-400 px-2 py-1 text-base">
            {t("doctor.history_operation.table.header.status_operation")}
          </th>
          <th className="border border-gray-400 px-2 py-1 text-base">
            {t("doctor.history_operation.table.header.notes")}
          </th>
          <th className="border border-gray-400 px-2 py-1 text-base">
            {t("doctor.history_operation.table.header.payment")}
          </th>
         
        </tr>
      </thead>
    </>
  );
}
