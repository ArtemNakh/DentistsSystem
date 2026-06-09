import { FieldArray, Field, ErrorMessage, useFormikContext } from "formik";
import { IOperationList } from "@/lib/redux/modules/OperationList/OperationList.interface";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { GetActionsByTitle } from "@/lib/redux/modules/FindingOperationList/OperationList/actions/GetActionByTitle/GetActionByTitle";
import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { RootState } from "@/lib/redux/store";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { GetActiveOperationListByDentistry } from "@/lib/redux/modules/OperationList/actions/GetActiveOperationListByDentistry/GetActiveOperationListByDentistry";

interface Props {}

export function ActionsOperationField({}: Props) {
  const { t } = useTranslation();
  const { values } = useFormikContext<any>();
  const [showOperationListModal, setShowOperationListModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const authUser: IWorker = UseDenormalizeSelector<IWorker>(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const existOperationList = Object.values(
    UseDenormalizeSelector<IOperationList[]>(
      (state: RootState) => state.operationList,
    ),
  );

  let operationList = useAppSelector(
    (state: RootState) => state.findingOperationList,
  );

  const [filteredOperationList, setFilteredOperationList] = useState<
    IOperationList[]
  >([]);

  //   Отримання стоматологічних операцій по назві
  useEffect(() => {
    if (searchQuery.length > 2) {
      if (authUser.dentistry?.id) {
        dispatch(
          GetActionsByTitle({
            title: searchQuery,
            dentistryId: authUser.dentistry.id,
          }),
        );
      }
    }
  }, [searchQuery, dispatch]);

  //  збирає список знайдених операцій
  useEffect(() => {
    if (searchQuery.length > 2) {
      const normalized: IOperationList[] = Object.values(operationList ?? {});
      setFilteredOperationList(normalized);
    } else {
      setFilteredOperationList([]);
    }
  }, [searchQuery, operationList]);

  // отримання усіх операцій для стоматології
  useEffect(() => {
    if (authUser.dentistry?.id) {
      console.log("test");
      dispatch(
        GetActiveOperationListByDentistry({
          dentistryId: authUser.dentistry.id,
        }),
      );
    }
  }, [authUser.dentistry?.id, dispatch]);
  return (
    <>
      <label className="block mb-2">
        {t("doctor.operation.operation_form.operation_actions")}
      </label>
      <FieldArray name="actions">
        {({ remove, push }) => (
          <div>
            {values.actions.map((actionId: string, index: number) => {
              const operation =
                filteredOperationList.find(
                  (op) => op.id === Number(actionId),
                ) ||
                existOperationList.find((op) => op.id === Number(actionId));

              return (
                <div key={index} className="flex mb-2">
                  <Field name={`actions.${index}`} type="hidden" />
                  <input
                    type="text"
                    value={operation ? operation.name : ""}
                    readOnly
                    className="border p-2 flex-1 bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    {t("doctor.operation.operation_form.delete")}
                  </button>
                </div>
              );
            })}

            <ErrorMessage
              name="actions"
              component="div"
              className="text-red-500"
            />

            <button
              type="button"
              onClick={() => setShowOperationListModal(true)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              {t("doctor.operation.operation_form.adding_action")}
            </button>

            {showOperationListModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                <div className="bg-linear-to-r from-[#874FD1] to-[#7562A5] border-2 border-gray-600 rounded-lg shadow-lg p-6 w-2/3 max-w-lg">
                  <h3 className="text-lg font-bold mb-4">
                    {t("doctor.operation.find_actions.FindOperation")}
                  </h3>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded mb-4"
                    placeholder={t(
                      "doctor.operation.find_actions.name_placeholder",
                    )}
                  />

                  {/* 🔍 блок знайдених операцій по назві */}
                  <h4 className="text-md font-semibold mb-2 text-white">
                    {t("doctor.operation.find_actions.search_results")}
                  </h4>
                  <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded mb-4">
                    {filteredOperationList.map((operation) => (
                      <li
                        key={operation.id}
                        onClick={() => {
                          push(operation.id);
                          setShowOperationListModal(false);
                        }}
                        className="p-2 hover:bg-[#7551B0] cursor-pointer"
                      >
                        {operation.name} — {operation.description}
                      </li>
                    ))}
                  </ul>

                  {/* 📋 блок усіх операцій для стоматології */}
                  <h4 className="text-md font-semibold mb-2 text-white">
                    {t("doctor.operation.find_actions.all_operations")}
                  </h4>
                  <ul className="max-h-40 overflow-y-auto border border-gray-300 rounded">
                    {existOperationList.map((operation) => (
                      <li
                        key={operation.id}
                        onClick={() => {
                          push(operation.id);
                          setShowOperationListModal(false);
                        }}
                        className="p-2 hover:bg-[#7551B0] cursor-pointer"
                      >
                        {operation.name} — {operation.description}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setShowOperationListModal(false)}
                    className="mt-4 px-4 py-2 bg-[#7C5CB6] border border-gray-700 text-white rounded hover:bg-purple-700"
                  >
                    {t("doctor.operation.find_actions.close")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </FieldArray>
    </>
  );
}
