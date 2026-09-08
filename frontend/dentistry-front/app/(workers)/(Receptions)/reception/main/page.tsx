"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import TablePationWithoutPay from "./components/TablePationWithoutPay";
import TableBusyDoctors from "./components/TableBusyDoctors";
import TableUpcomingEntries from "./components/TableUpcominsEntries";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getPaymentsDentistry } from "@/lib/redux/modules/Payments/actions/getAllPaymentsByDentisty/getAllPaymentsByDentistry";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { getAppointmentNearestTodayDentistry } from "@/lib/redux/modules/Appointments/actions/GetNearestTodayByDentistry/GetNearestTodayByDentistry";
import { getAppointmentTodayDentistry } from "@/lib/redux/modules/Appointments/actions/GetTodayOperationByDentistry/GetTodayOperationByDentistry";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";

export function AdminsMain() {
  const authUser = useAppSelector(
    (state: { auth: AuthState }) => state.auth.user,
  ) as IWorker;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authUser) {
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) return;
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

    if (authUser.id) {
      dispatch(
        getAppointmentTodayDentistry({
          dentistryId: authUser.dentistry.id,
        }),
      );
    }
  }, [authUser, dispatch]);

  return (
    <>
      {/* Body */}
      <div>
        <div>
          <div className=" flex ">
            {/* left part */}
            <div className="w-1/2 relative">
              <TableUpcomingEntries />
            </div>

            {/* right patt */}
           
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminsMain;
