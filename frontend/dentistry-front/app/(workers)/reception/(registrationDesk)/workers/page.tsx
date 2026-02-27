import { cookies } from "next/headers";
import WorkerReception from "./Workers";

export default async function WorkerReceptionSSR() {
  // // читаємо cookie із sessionId

  
  // const idDentistry = 2; //додати id стоматології від працівника
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/workers/all/doctors?dentistry=${idDentistry}`,
  //   { cache: "no-store" },
  // );
  // const workersDoctors= await res.json();
  
  // return <WorkerReception workersDoctors={[...workersDoctors]} />;
   return <WorkerReception  />;

}
