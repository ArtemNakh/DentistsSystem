// ListLicensesWorker.tsx
import { ILicense } from "@/lib/redux/modules/Licenses/Licenses.interface";
import { useTranslation } from "react-i18next";

interface Props {
  licenses: ILicense[];
}

export default function ListLicensesWorker({ licenses }: Props) {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Мої ліцензії
      </h3>
      {licenses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {licenses.map((license) => (
            <div
              key={license.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-gray-500">Номер ліцензії</p>
              <p className="font-medium text-gray-800 mb-2">
                {license.number_license}
              </p>

              <p className="text-sm text-gray-500">Видана ким</p>
              <p className="text-gray-700 mb-2">{license.issued_by}</p>

              <p className="text-sm text-gray-500">Дата видачі</p>
              <p className="text-gray-700 mb-2">
                {new Date(license.issue_date).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-500">Дата закінчення</p>
              <p className="text-gray-700 mb-2">
                {new Date(license.expiration_date).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-500">Створено</p>
              <p className="text-gray-700 mb-2">
                {new Date(license.created_at).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-500">Оновлено</p>
              <p className="text-gray-700">
                {new Date(license.updated_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Немає ліцензій</p>
      )}
    </div>
  );
}
