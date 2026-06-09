import { useTranslation } from "react-i18next";

interface TableHeaderPaymentsProps {}
export default function TableHeaderPayments({}: TableHeaderPaymentsProps) {
  const { t } = useTranslation();
  return (
    <>
      <thead>
        <tr className="border-gray-400">
          <th className="border  px-4 py-2 text-center">
            {t("doctor.payments.table_header.client")}
          </th>
          <th className="border  px-4 py-2 text-center">
            {t("doctor.payments.table_header.amount")}
          </th>
          <th className="border  px-4 py-2 text-center">
            {t("doctor.payments.table_header.status")}
          </th>
          <th className="border  px-4 py-2 text-center">
            {t("doctor.payments.table_header.method")}
          </th>
          <th className="border  px-4 py-2 text-center">
            {t("doctor.payments.table_header.payment_date")}
          </th>
          <th className="border  px-4 py-2 text-center">
            {t("doctor.payments.table_header.actions")}
          </th>
        </tr>
      </thead>
    </>
  );
}
