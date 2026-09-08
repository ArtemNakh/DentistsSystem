"use client";
import {
  useAppDispatch,
  useAppSelector,
  UseDenormalizeSelector,
} from "@/lib/redux/hooks";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { GetOperationListByDentistry } from "@/lib/redux/modules/OperationList/actions/GetOperationListByDentistry/GetOperationListByDentistry";
import { IOperationList } from "@/lib/redux/modules/OperationList/OperationList.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateOperationSchema } from "./schemes/CreateOperation.schema";
import { updateOperationSchema } from "./schemes/UpdateOperation.schema";
import { AddOperation } from "@/lib/redux/modules/OperationList/actions/AddOperation/AddOperation";
import { UpdateOperation } from "@/lib/redux/modules/OperationList/actions/UpdateOperation/UpdateOperation";

export default function OperationList() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const authUser: IWorker = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const operationList: IOperationList[] = Object.values(
    UseDenormalizeSelector<IOperationList[]>(
      (state: RootState) => state.operationList,
    ) || {},
  );

  const [skip, setSkip] = useState(0);
  const takeOperations = 50;
  const [selectedOperation, setSelectedOperation] =
    useState<IOperationList | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (authUser) {
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser?.dentistry?.id) return;
    dispatch(
      GetOperationListByDentistry({
        dentistryId: authUser.dentistry.id,
        take: takeOperations,
        skip: skip,
      }),
    );
  }, [authUser, skip, dispatch]);

  return (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">
          {t("admins.operation_list.list_title")}
        </h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2  mb-2 bg-[#7354b0] border border-gray-300 text-white rounded-lg shadow hover:bg-purple-700 transition"
        >
          {t("admins.operation_list.add_operation")}
        </button>
        <div className="overflow-x-auto">
          {operationList.length === 0 ? (
            <p className="text-gray-200 text-center py-6 ">
              {t("admins.operation_list.no_data")}
            </p>
          ) : (
            <>
              <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      {t("admins.operation_list.name")}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      {t("admins.operation_list.description")}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      {t("admins.operation_list.price")}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      {t("admins.operation_list.status")}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      {t("admins.operation_list.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {operationList.map((op, index) => (
                    <tr key={op.id} className="border-t hover:bg-black/10">
                      <td className="px-4 py-2">{index + 1}</td>

                      <td className="px-4 py-2 font-medium ">{op.name}</td>
                      <td className="px-4 py-2 ">{op.description || "—"}</td>
                      <td className="px-4 py-2  font-semibold">
                        {op.price} грн
                      </td>
                      <td className="px-4 py-2  font-semibold">
                        {String(op.active)}
                      </td>
                      <td className="px-4 py-2 flex gap-3">
                        <button
                          onClick={() =>
                            dispatch(
                              dispatch(
                                UpdateOperation({
                                  operationId: op.id,
                                  name: op.name,
                                  description: op.description,
                                  price: op.price,
                                  active: !op.active,
                                }),
                              ),
                            )
                          }
                          className="px-2 py-1 text-sm font-medium  text-white rounded-lg shadow hover:bg-black/10 border border-gray-400 hover:shadow-md transition-transform transform hover:scale-105"
                        >
                          {t("admins.operation_list.update_status")}
                        </button>
                        <button
                          onClick={() => setSelectedOperation(op)}
                          className="px-2 py-1 text-sm font-medium text-white rounded-lg shadow  hover:bg-black/10 border border-gray-400 hover:shadow-md transition-transform transform hover:scale-105"
                        >
                          {t("admins.operation_list.edit")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setSkip((prev) => prev + takeOperations)}
                  className="px-4 py-2 mb-5 border border-gray-700 bg-[#6f3aaf] text-white rounded scale-100  hover:scale-105 hover:bg-[#7946b7] transition"
                >
                  {t("admins.operation_list.load_more")}
                </button>
              </div>
            </>
          )}
        </div>
        {selectedOperation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-6 rounded-lg shadow-lg w-125">
              <h3 className="text-xl font-bold mb-4">
                {t("admins.operation_list.modal.update.edit_operation")}
              </h3>
              <Formik
                initialValues={{
                  name: selectedOperation.name || "",
                  description: selectedOperation.description || "",
                  price: selectedOperation.price || 0,
                  status: selectedOperation.active || false,
                }}
                validationSchema={updateOperationSchema(t)}
                onSubmit={(values) => {
                  dispatch(
                    UpdateOperation({
                      operationId: selectedOperation.id,
                      ...values,
                    }),
                  );
                  setSelectedOperation(null);
                }}
              >
                {() => (
                  <Form className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {t("admins.operation_list.modal.update.name")}
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {t("admins.operation_list.modal.update.description")}
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {t("admins.operation_list.modal.update.price")}
                      </label>
                      <Field
                        name="price"
                        type="number"
                        className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Field name="active" type="checkbox" />
                      {t("admins.operation_list.modal.update.status")}
                    </label>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOperation(null)}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                      >
                        {t("admins.operation_list.modal.update.cancel")}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-gray-450  text-white rounded hover:bg-black/10 transition"
                      >
                        {t("admins.operation_list.modal.update.save")}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {/* Модалка для створення */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 text-white p-6 rounded-lg shadow-lg w-125">
              <h3 className="text-xl font-bold mb-4">
                {t("admins.operation_list.modal.create.add_operation")}
              </h3>
              <Formik
                initialValues={{
                  name: "",
                  description: "",
                  price: 0,
                  active: true,
                }}
                validationSchema={CreateOperationSchema(t)}
                onSubmit={(values) => {
                  dispatch(AddOperation(values));
                  setIsCreateModalOpen(false);
                }}
              >
                {() => (
                  <Form className="flex flex-col gap-4">
                    <div>
                      <label className="text-sm font-medium">
                        {t("admins.operation_list.modal.create.name")}
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {t("admins.operation_list.modal.create.description")}
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">
                        {t("admins.operation_list.modal.create.price")}
                      </label>
                      <Field
                        name="price"
                        type="number"
                        className="w-full mt-1 px-3 py-2 rounded bg-purple-900 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Field name="active" type="checkbox" />
                      {t("admins.operation_list.modal.create.status")}
                    </label>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                      >
                        {t("admins.operation_list.modal.create.cancel")}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-gray-400 text-white rounded hover:bg-black/10 transition"
                      >
                        {t("admins.operation_list.modal.create.save")}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
