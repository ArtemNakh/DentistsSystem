"use client";

import { RootState, useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  ClientActionSaga,
  ClientsState,
} from "@/lib/redux/modules/clients/ClientEntity";
import { useEffect } from "react";
import { shallowEqual } from "react-redux";

function AdminsMain() {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(
    (state: RootState) => Object.values(state.Clients as ClientsState),
    shallowEqual,
  );

  useEffect(() => {
    dispatch({ type: ClientActionSaga.GetClients });
  }, [dispatch]);
  return (
    <ul>
      {" "}
      {clients.map((client: any) => (
        <li key={client.id}>{client.name}</li>
      ))}{" "}
    </ul>
  );
}

export default AdminsMain;
