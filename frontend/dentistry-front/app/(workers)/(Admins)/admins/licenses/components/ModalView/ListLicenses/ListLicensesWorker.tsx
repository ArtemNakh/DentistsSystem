
import { ILicense } from "@/lib/redux/modules/Licenses/Licenses.interface";
import { useState } from "react";
import CreateLicenseModal from "../CreateLicense/CreateLicense";
import { RemoveLicense } from "@/lib/redux/modules/Licenses/actions/RemoveLicense/RemoveLicense";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useTranslation } from "react-i18next";

interface Props {
  workerId: number;
  licenses: ILicense[];
}

export default function ListLicensesWorker({ workerId, licenses }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const workerLicenses = licenses.filter(
    (lic: ILicense) => lic.worker?.id === workerId,
  );
  const [showCreateLicense, setShowCreateLicense] = useState(false);

  return (
    <td
      colSpan={7}
      className="border p-4 bg-linear-to-l from-[#7C48BF] to-[#776EA3]"
    >
      <div>
        <h3 className="text-lg font-bold mb-3 text-white">
          {t("admins.license.list_license.licenses")}:
        </h3>
        {workerLicenses.length === 0 ? (
          <p className="text-gray-200 italic">
            {t("admins.license.list_license.no_licenses")}
          </p>
        ) : (
          <div className="grid gap-3">
            {workerLicenses.map((lic) => (
              <div
                key={lic.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-white font-semibold">
                      № {lic.number_license}
                    </p>
                    <p className="text-sm text-gray-200">
                      {t("admins.license.list_license.issued_by")}:{" "}
                      <span className="font-medium">{lic.issued_by}</span>
                    </p>
                    <p className="text-sm text-gray-200">
                      {t("admins.license.list_license.issue_date")}:{" "}
                      <span className="bg-green-600/30 text-green-200 px-2 py-0.5 rounded">
                        {new Date(lic.issue_date).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-200">
                      {t("admins.license.list_license.expiration_date")}:{" "}
                      <span className="bg-red-600/30 text-red-200 px-2 py-0.5 rounded">
                        {new Date(lic.expiration_date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow"
                    onClick={() => dispatch(RemoveLicense({ id: lic.id }))}
                  >
                    {t("admins.license.list_license.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-4 px-4 py-2 bg-[#7963AC] hover:bg-[#685594] text-white font-medium rounded-md shadow-md"
          onClick={() => setShowCreateLicense(true)}
        >
          {t("admins.license.list_license.add_license")}
        </button>
      </div>
      {showCreateLicense && (
        <CreateLicenseModal
          workerId={workerId}
          onClose={() => setShowCreateLicense(false)}
        />
      )}
    </td>
  );
}
