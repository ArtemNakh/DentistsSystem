"use client";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useEffect, useRef, useState } from "react";
import ShowAppointmentActions from "./ModalView/ShowAppointmentActions";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { IPayment } from "@/lib/redux/modules/Payments/Payments.interface";
import ShowPaymentModal from "./ModalView/ShowPaymentModal";

interface TableHistoryAppointmentsProps {
  appointments: IAppointment[];
  onLoadMore: () => void;
}

export default function TableHistoryAppointments({
  appointments,onLoadMore
}: TableHistoryAppointmentsProps) {
  const { t } = useTranslation();
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);



  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [onLoadMore]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white border border-amber-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
          >
            {/* Worker */}
            <p className="text-gray-700 mb-1">
              <span className="font-medium">
                {t("client.history_operation.table.header.worker")}:
              </span>{" "}
              {appointment.dentist?.surname} {appointment.dentist?.name}
            </p>

            {/* Date */}
            <p className="text-gray-700 mb-1">
              <span className="font-medium">
                {t("client.history_operation.table.header.operation_date")}:
              </span>
              {appointment.appointment_date
                ? format(
                    new Date(appointment.appointment_date),
                    "dd.MM.yyyy HH:mm",
                  )
                : "—"}
            </p>

            {/* Status */}
            <p className="text-gray-700 mb-1">
              <span className="font-medium">
                {" "}
                {t("client.history_operation.table.header.status_operation")}:
              </span>{" "}
              {appointment.status}
            </p>

            {/* Payment */}
            <p className="text-gray-700 mb-1">
              <span className="font-medium">
                {t("client.history_operation.table.header.payment")}:
              </span>{" "}
              {appointment.payment ? appointment.payment.amount : "—"}
              {appointment.payment && (
                <button
                  onClick={() =>
                    setSelectedPayment(
                      selectedPayment?.id === appointment.payment?.id
                        ? null
                        : (appointment.payment ?? null),
                    )
                  }
                  className="ml-2 text-amber-600 hover:underline text-sm"
                >
                  {t("client.history_operation.table.payment_modal.open")}
                </button>
              )}
            </p>

            {/* Notes */}
            {appointment.notes && (
              <p className="text-gray-700 mb-2">
                <span className="font-medium">
                  {t("client.history_operation.table.header.notes")}:
                </span>{" "}
                {appointment.notes}
              </p>
            )}

            {/* Actions */}
            <button
              onClick={() => setSelectedAppointment(appointment)}
              className="mt-3 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
            >
              {t("client.history_operation.table.header.actions")}
            </button>
            {/* Payment Modal */}
            {selectedPayment?.id === appointment.payment?.id && (
              <ShowPaymentModal
                payment={selectedPayment}
                setPayment={setSelectedPayment}
              />
            )}
          </div>
        ))}
      </div>
 <div ref={observerRef} className="h-1"></div>

      <ShowAppointmentActions
        appointment={selectedAppointment}
        setAppointment={setSelectedAppointment}
      />
    </>
  );
}
