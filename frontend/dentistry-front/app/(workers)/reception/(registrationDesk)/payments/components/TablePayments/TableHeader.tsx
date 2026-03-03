
interface TableHeaderPaymentsProps{

}
export default function TableHeaderPayments({}:TableHeaderPaymentsProps) {
  return (
    <>
      <thead>
        <tr className="border-gray-400">
          <th className="border  px-4 py-2 text-center">Client</th>
          <th className="border  px-4 py-2 text-center">Worker</th>
          <th className="border  px-4 py-2 text-center">Amount</th>
          <th className="border  px-4 py-2 text-center">Status</th>
          <th className="border  px-4 py-2 text-center">Method</th>
          <th className="border  px-4 py-2 text-center">Payment Date</th>
          <th className="border  px-4 py-2 text-center">Action</th>
        </tr>
      </thead>
    </>
  );
}
