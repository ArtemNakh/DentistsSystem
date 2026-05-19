import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

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
