"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import TablePationWithoutPay from "./components/TablePationWithoutPay";
import TableBusyDoctors from "./components/TableBusyDoctors";
import TableUpcomingEntries from "./components/TableUpcominsEntries";
import { AppointmentActionSaga } from "@/lib/redux/modules/Appointments/Appointment.Entity";

import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { getPaymentsDentistry } from "@/lib/redux/modules/Payments/actions/getAllPaymentsByDentisty/getAllPaymentsByDentistry";
import { AuthActionSaga } from "@/lib/redux/modules/AuthUser/AuthUser.Entity";
import { getAuthWorker } from "@/lib/redux/modules/AuthUser/actions/GetAuthWorker/GetAuthWorker";
import { getAppointmentNearestTodayDentistry } from "@/lib/redux/modules/Appointments/actions/GetNearestTodayByDentistry/GetNearestTodayByDentistry";
import { getAppointmentTodayDentistry } from "@/lib/redux/modules/Appointments/actions/GetTodayOperationByDentistry/GetTodayOperationByDentistry";

export function AdminsMain() {
  const { t } = useTranslation();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);

  const dispatch = useAppDispatch();

  
  useEffect(() => {
    if (authUser.user) {
      console.log("work");
      return;
    }
    dispatch(getAuthWorker({}));
  }, [dispatch]);

  useEffect(() => {
    if (!authUser.user) return;

    // тепер user гарантовано є
    dispatch(
      getAppointmentNearestTodayDentistry({
        dentistryId: authUser.user.dentistry.id,
      }),
    );

    if (authUser.user.dentistry?.id) {
      dispatch(
        getPaymentsDentistry({ dentistryId: authUser.user.dentistry.id }),
      );
    }

    if (authUser.user.id) {
      dispatch(
        getAppointmentTodayDentistry({
          dentistryId: authUser.user.dentistry.id,
        }),
      );
    }
  }, [authUser.user, dispatch]);

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminsMain;
