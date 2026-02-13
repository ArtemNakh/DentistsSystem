"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ClientActionSaga } from "@/lib/redux/modules/clients/ClientEntity";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual } from "react-redux";

import HeaderAdmin from "../components/Header";
import TablePationWithoutPay from "./components/TablePationWithoutPay";
import TableBusyDoctors from "./components/TableBusyDoctors";
import TableUpcomingEntries from "./components/TableUpcominsEntries";
import { WorkerActionSaga } from "@/lib/redux/modules/Workers/Workers.Entity";
import { AppointmentActionSaga } from "@/lib/redux/modules/Appointments/AppointmentEntity";

function AdminsMain() {
  const { t } = useTranslation();
  // const clients = Object.values(useAppSelector((state) => state.videos) || {});
  // const appointments = useAppSelector((state) =>
  //   Object.values(state.Appointments),
  // );
  // const unpaidPatients = useAppSelector((state) =>
  //   Object.values(state.Clients).filter((c:any) => !c.paid),
  // );
  // const busyDoctors = useAppSelector((state) =>
  //   Object.values(state.Workers).filter((w:any) => w.isOperating),
  // );

  const dispatch = useAppDispatch();

  // const dispatch = useAppDispatch();
  // const clients = useAppSelector(
  //   (state: RootState) => Object.values(state.Clients as ClientsState),
  //   shallowEqual,
  // );

  // useEffect(() => {
  //   dispatch({ type: ClientActionSaga.GetClient});
  // }, [dispatch]);
  useEffect(() => {
    // dispatch({ type: WorkerActionSaga.GetWorker });
    // зробити щоб йшов запит із датою у параметрах
    dispatch({
      type: AppointmentActionSaga.GetNearestToday,
      // payload: { date },
    });
    // dispatch({ type: ClientActionSaga.GetClient });
  }, [dispatch]);
  // тестові дані

  return (
    <>
      {/* HEader
      <HeaderAdmin /> */}

      {/* Body */}
      <div>
        <div>
          {/* className="w-full h-fit bg-linear-to-l from-[#874FD1] to-[#6F6697] " */}
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

      {/* footer */}
    </>
  );
}

export default AdminsMain;
