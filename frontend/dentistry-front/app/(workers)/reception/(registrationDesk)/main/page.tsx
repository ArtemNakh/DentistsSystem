"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ClientActionSaga } from "@/lib/redux/modules/Clients/ClientEntity";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shallowEqual } from "react-redux";

import HeaderAdmin from "../components/Header";
import TablePationWithoutPay from "./components/TablePationWithoutPay";
import TableBusyDoctors from "./components/TableBusyDoctors";
import TableUpcomingEntries from "./components/TableUpcominsEntries";
import { WorkerActionSaga } from "@/lib/redux/modules/Workers/Workers.Entity";
import { AppointmentActionSaga } from "@/lib/redux/modules/Appointments/Appointment.Entity";
import { PaymentActionSaga } from "@/lib/redux/modules/Payments/Payments.Entity";
import { createSelector } from "@reduxjs/toolkit";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";

export function AdminsMain() {
  const { t } = useTranslation();

  // const workers = useAppSelector((state) => state.workers);
  const dispatch = useAppDispatch();
  // console.log("worers",workers)
 useEffect(() => {
  fetch("http://localhost:4000/workers/me", {
    method: "GET",
    credentials: "include", // важливо!
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then((data) => {
      console.log("Worker ID:", data.workerId);
    })
    .catch((err) => console.error(err));
}, []);


  useEffect(() => {
    // dispatch({ type: WorkerActionSaga.GetWorker });
    // зробити щоб йшов запит із датою у параметрах
    dispatch({
      type: AppointmentActionSaga.GetNearestToday,
      //  payload: { date },
    });
    dispatch({
      type: PaymentActionSaga.GetPaiments,
      payload: { id: 2 },
    });

    dispatch({
      type: AppointmentActionSaga.GetTodayOperation,
      payload: { workerId: 2 }, // тут передаємо id працівника
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
