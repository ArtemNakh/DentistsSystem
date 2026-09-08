
import OperationClient from "./OperationClient";


export default async function OperationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;   // розпаковуємо Promise
  console.log("id", id);

  return <OperationClient id={id} />;
}
