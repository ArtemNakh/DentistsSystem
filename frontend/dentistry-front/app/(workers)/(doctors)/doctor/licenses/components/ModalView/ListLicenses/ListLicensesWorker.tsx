// ListLicensesWorker.tsx
import { ILicense } from "@/lib/redux/modules/Licenses/Licenses.interface";
import { useState } from "react";
import CreateLicenseModal from "../CreateLicense/CreateLicense";
import { RemoveLicense } from "@/lib/redux/modules/Licenses/actions/RemoveLicense/RemoveLicense";
import { useAppDispatch } from "@/lib/redux/hooks";

interface Props {
  workerId: number;
  licenses: ILicense[];
}

export default function ListLicensesWorker({ workerId, licenses }: Props) {
  const dispatch = useAppDispatch();
  const workerLicenses = licenses.filter(
    (lic: ILicense) => lic.worker?.id === workerId,
  );
  const [showCreateLicense, setShowCreateLicense] = useState(false);

  return (
    <td
      colSpan={7}
      className="border p-2 bg-linear-to-l from-[#7C48BF] to-[#776EA3]"
    >
      <div>
        <h3 className="font-semibold mb-2">Ліцензії:</h3>
        {workerLicenses.length === 0 ? (
          <p className="text-gray-200">Немає ліцензій</p>
        ) : (
          <ul className="space-y-2">
            {workerLicenses.map((lic) => (
              <li
                key={lic.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <span className="font-medium">{lic.number_license}</span>{" "}
                  <span className="font-medium">
                    Дата згасання:{" "}
                    <span className="font-medium">
                      Дата згасання:{" "}
                      <span>
                        Дата згасання:{" "}
                        {new Date(lic.expiration_date).toLocaleDateString()}
                      </span>
                    </span>
                  </span>{" "}
                  <span className="font-medium">Видав: {lic.issued_by}</span>{" "}
                  <span className="text-sm text-gray-200">
                    (видано: {new Date(lic.issue_date).toLocaleDateString()})
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-[#7B4DBC] hover:bg-[#6C4DA1] border border-gray-700 text-white rounded"
                    onClick={() => dispatch(RemoveLicense({ id: lic.id }))}
                  >
                    Видалити
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          className="mt-2 px-3 py-1 bg-[#7963AC] border border-gray-600 hover:bg-[#685594] text-white rounded"
          onClick={() => setShowCreateLicense(true)}
        >
          Додати ліцензію
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
