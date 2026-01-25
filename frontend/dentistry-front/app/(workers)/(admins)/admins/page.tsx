
"use client";
import { ClientActionSaga } from "@/lib/redux/clientSaga";
import { createSelector } from "@reduxjs/toolkit";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminsMain() {
  const dispatch = useDispatch();
  // const clients = useSelector((state: any) => Object.values(state.Clients));
  const selectClients = createSelector(
    (state: any) => state.Clients,
    (clients) => Object.values(clients),
  );
  const clients = useSelector(selectClients);

  useEffect(() => {
    dispatch({ type: ClientActionSaga.GetClients });
  }, [dispatch]);

  return (
    <>
      <h1>Clients</h1>
      <ul>
        {clients.map((client: any) => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </>
  );
}

export default AdminsMain;
