"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getAuthClient } from "@/lib/redux/modules/AuthUser/actions/GetAuthClient/GetAuthClient";
import { AuthState } from "@/lib/redux/modules/AuthUser/AuthUser.interface";
import { format } from "date-fns";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";

export default function ClientProfile() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state: { auth: AuthState }) => state.auth);
  const client = authUser?.user as IClient; // поточний користувач

  useEffect(() => {
    // при завантаженні сторінки робимо запит на отримання користувача
    if (!authUser?.user) {
      dispatch(getAuthClient({}));
    }
  }, [dispatch, authUser?.user]);

  if (!client) {
    return (
      <div className="w-full px-4 py-6 text-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6">
      <div className="bg-white border border-amber-200 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-yellow-600 mb-6">
          Profile Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <span className="font-medium text-amber-700">Name:</span>{" "}
            {client.name}
          </div>
          <div>
            <span className="font-medium text-amber-700">Surname:</span>{" "}
            {client.surname}
          </div>
          {client.middle_name && (
            <div>
              <span className="font-medium text-amber-700">Middle Name:</span>{" "}
              {client.middle_name}
            </div>
          )}
          <div>
            <span className="font-medium text-amber-700">Birthdate:</span>{" "}
            {format(new Date(client.birthdate), "dd.MM.yyyy")}
          </div>
          <div>
            <span className="font-medium text-amber-700">Blood Group:</span>{" "}
            {client.blood_group}
          </div>
          <div>
            <span className="font-medium text-amber-700">Rh Factor:</span>{" "}
            {client.blood_resus === "plus" ? "+" : "-"}
          </div>
          <div>
            <span className="font-medium text-amber-700">Phone:</span>{" "}
            {client.phone}
          </div>
          <div>
            <span className="font-medium text-amber-700">Email:</span>{" "}
            {client.email}
          </div>
          {client.allergic_diseases && (
            <div className="md:col-span-2">
              <span className="font-medium text-amber-700">Allergies:</span>{" "}
              {client.allergic_diseases}
            </div>
          )}
          <div>
            <span className="font-medium text-amber-700">Verified:</span>{" "}
            {client.isVerified ? "Yes" : "No"}
          </div>
        </div>
      </div>
    </div>
  );
}
