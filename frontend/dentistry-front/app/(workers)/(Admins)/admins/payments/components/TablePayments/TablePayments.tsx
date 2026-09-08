import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import TableBodyPayments from "./TableBody";
import TableHeaderPayments from "./TableHeader";

interface TablePaymentsProps {
  payments: IPayment[];
}

export default function TablePayments({ payments }: TablePaymentsProps) {
  return (
    <>
      <div className="w-full px-4 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-600 text-base">
          <TableHeaderPayments />

          <TableBodyPayments payments={payments} />
        </table>
      </div>
    </>
  );
}
