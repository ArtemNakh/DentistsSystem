import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

interface ShowPaymentModal {
  payment: IPayment | null;
  setPayment: React.Dispatch<React.SetStateAction<IPayment | null>>;
}

export default function ShowPaymentModal({
  payment,
  setPayment,
}: ShowPaymentModal) {
  const { t } = useTranslation();

  return (
    <>
      {payment && (
        <div
          className="absolute right-full top-1/2 -translate-y-1/2 mr-2 
                    bg-white shadow-lg rounded-md p-4 border w-64"
        >
          <p>
            {t("reception.history_operation.table.body.payment_modal.amount")}{" "}
            {payment?.amount}
          </p>
          <p>
            {t(
              "reception.history_operation.table.body.payment_modal.method_pay",
            )}
            {payment?.method_pay}
          </p>
          <p>
            {t(
              "reception.history_operation.table.body.payment_modal.payment_day",
            )}

            {payment?.payment_date
              ? format(new Date(payment.payment_date), "dd.MM.yyyy HH:mm")
              : "—"}
          </p>
          <p>
            {t(
              "reception.history_operation.table.body.payment_modal.status_pay",
            )}
            {payment?.status_paid}
          </p>
        </div>
      )}
    </>
  );
}
