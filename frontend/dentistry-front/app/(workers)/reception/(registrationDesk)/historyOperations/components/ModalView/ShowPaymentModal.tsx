import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { format } from "date-fns";

interface ShowPaymentModal {
  payment: IPayment | null;
  setPayment: React.Dispatch<React.SetStateAction<IPayment | null>>;
}

export default function ShowPaymentModal({
  payment,
  setPayment,
}: ShowPaymentModal) {
  return (
    <>
      {payment && (
        <div
          className="absolute right-full top-1/2 -translate-y-1/2 mr-2 
                    bg-white shadow-lg rounded-md p-4 border w-64"
        >
          <p>Amount: {payment?.amount}</p>
          <p>Method pay: {payment?.method_pay}</p>
          <p>
            Payment day:
            {payment?.payment_date
              ? format(new Date(payment.payment_date), "dd.MM.yyyy HH:mm")
              : "—"}
          </p>
          <p>Status pay: {payment?.status_paid}</p>
        </div>
      )}
    </>
  );
}
