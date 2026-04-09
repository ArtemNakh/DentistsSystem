import { useAppSelector } from "@/lib/redux/hooks";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
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
  const { user, loading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading && user?.id) {
      setFieldValue("clientId", user.id);
    }
  }, [loading, user, setFieldValue]);

  return (
    <>
      <div className="mx-5 text-gray-500">
        <div className="flex items-center gap-2">
          <Field type="hidden" name="clientId" />
        </div>

        <ErrorMessage
          name="clientId"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
