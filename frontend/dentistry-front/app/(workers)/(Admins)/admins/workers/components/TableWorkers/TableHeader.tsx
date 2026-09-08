import { useTranslation } from "react-i18next";

interface TableHeaderWorkerProps {}

export default function TableHeaderWorker({}: TableHeaderWorkerProps) {
  const { t } = useTranslation();
  return (
    <>
      <thead className="">
        <tr>
          <th className="border border-gray-400 w-1/2  px-2 py-1">
            {t("admins.workers.table_header.fio")}
          </th>
          <th className="border  border-gray-400 w-auto  px-1 py-1">
            {t("admins.workers.table_header.specialty")}
          </th>
          <th className="border border-gray-400  w-32 px-2 py-1">
            {t("admins.workers.table_header.birthday")}
          </th>
          <th className="border border-gray-400 px-2 w-40 py-1">
            {t("admins.workers.table_header.phone")}
          </th>
          <th className="border border-gray-400 px-2 py-1">
            {t("admins.workers.table_header.actions")}
          </th>
        </tr>
      </thead>
    </>
  );
}
