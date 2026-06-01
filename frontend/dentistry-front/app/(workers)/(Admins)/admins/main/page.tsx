"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import TablePationWithoutPay from "./components/TablePationWithoutPay";
import TableBusyDoctors from "./components/TableBusyDoctors";
import TableUpcomingEntries from "./components/TableUpcominsEntries";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getPaymentsDentistry } from "@/lib/redux/modules/Payments/actions/getAllPaymentsByDentisty/getAllPaymentsByDentistry";
import { getAppointmentNearestTodayDentistry } from "@/lib/redux/modules/Appointments/actions/GetNearestTodayByDentistry/GetNearestTodayByDentistry";
import { getAppointmentTodayDentistry } from "@/lib/redux/modules/Appointments/actions/GetTodayOperationByDentistry/GetTodayOperationByDentistry";
import { GetWorkersAppointmentStats } from "@/lib/redux/modules/ADMINS/Stats/WorkerStats/actions/GetWorkersStats/GetWorkersStats";
import TableWorkersStats from "./components/TableAppointmentsWorkers";
import TableWorkersWeekend from "./components/TableWeekendWorkers";
import { GetNumbersWorkersWeekend } from "@/lib/redux/modules/ADMINS/Stats/WeekendStats/actions/WeekendStats.entity";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export function AdminsMain() {
  const authUser:IWorker = useAppSelector((state: { auth: AuthState }) => state.auth.user) as IWorker;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!authUser) return;
    dispatch(
      GetWorkersAppointmentStats({
        dentistryId: authUser.dentistry.id,
      }),
    ),

    dispatch(GetNumbersWorkersWeekend({dentistryId:authUser.dentistry.id,}))
    dispatch(
      getAppointmentNearestTodayDentistry({
         dentistryId: authUser.dentistry.id,
        }),
    );

    if (authUser.dentistry?.id) {
      dispatch(
        getPaymentsDentistry({ dentistryId: authUser.dentistry.id }),
      );
    }

    dispatch(
      getAppointmentTodayDentistry({
        dentistryId: authUser.dentistry.id,
      }),
    );
  }, [authUser, dispatch]);

  return (
    <>
      {/* Body */}
      <div>
        <div>
          <div className=" flex ">
            {/* left part */}
            {/* показування найближчих операцій
             додати показ актуального по часу записів(якщо час 12 то показувати записі до 12) , додати фільри по часу,доктору, пошук пацієкнта */}
            <div className="w-1/2 relative">
              <TableUpcomingEntries />
              <TableWorkersStats /> {/* нова таблиця зі статистикою */}
            </div>

            {/* right patt */}
            {/* змінити */}
            {/* таблиця , хто не вніс ще оплату */}
            {/* таблиця хто зараз проводить операцію */}
            <div className="w-1/2">
              <div className=" mx-5 h-auto">
                <div className="h-1/2 ">
                  {/* Таблиця пацієнтів без оплати */}
                  <TablePationWithoutPay />
                </div>
                <div className="h-1/2">
                  {/* Таблиця лікарів, які зараз оперують */}
                  <TableBusyDoctors />
                </div>
                <div className="h-1/2">
                  <TableWorkersWeekend />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminsMain;
