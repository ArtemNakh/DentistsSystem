import { useAppSelector } from "@/lib/redux/hooks";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
import { RootState } from "@/lib/redux/store";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function generateHourlySlots(start: string, end: string) {
  const slots: string[] = [];
  const [startHour] = start.split(":").map(Number);
  const [endHour] = end.split(":").map(Number);

  // генеруємо години від startHour до endHour - 1
  for (let h = startHour; h < endHour; h++) {
    const hourStr = `${String(h).padStart(2, "0")}:00`;

    slots.push(hourStr);
  }

  return slots;
}

export default function AppointmentDateField() {
  const { t } = useTranslation();

  const workerShiftsObj = useAppSelector(
    (state: RootState) => state.workerShifts,
  );
  const workerShifts = Array.isArray(workerShiftsObj)
    ? workerShiftsObj
    : Object.values(workerShiftsObj ?? {});

  const appointmentsObj = useAppSelector(
    (state: RootState) => state.appointments,
  );
  const appointments = Array.isArray(appointmentsObj)
    ? appointmentsObj
    : Object.values(appointmentsObj ?? {});

  const { setFieldValue } = useFormikContext<any>();
  const [selectedDate, setSelectedDate] = useState<string>("");

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];

    // знаходимо shift для цього дня
    const shift = workerShifts.find(
      (s: any) =>
        new Date(s.shift_date).toDateString() ===
        new Date(selectedDate).toDateString(),
    );
    if (!shift) return [];

    // генеруємо всі години між start_time і end_time
    let times = generateHourlySlots(shift.start_time, shift.end_time);

    // виключаємо зайняті години
    times = times.filter((time) => {
      const [slotHour] = time.split(":").map(Number);

      const isBusy = appointments.some((a: any) => {
        const appointmentDate = new Date(a.appointment_date);

        const appointmentHour = appointmentDate.getHours();
        const appointmentMinutes = appointmentDate.getMinutes();

        return (
          appointmentDate.toDateString() ===
            new Date(selectedDate).toDateString() &&
          appointmentHour === slotHour &&
          appointmentMinutes === 0
        );
      });

      return !isBusy;
    });

    return times;
  }, [selectedDate, workerShifts, appointments]);

  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-600">
          {t("Дата операції")}
        </label>
        <Field
          id="appointment_date"
          name="appointment_date"
          type="date"
          className="placeholder-gray-400 text-gray-200 border border-gray-400 rounded px-2 py-1 focus:outline-none hover:border-gray-950"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedDate(e.target.value);
            setFieldValue("appointment_date", new Date(e.target.value));
          }}
          validate={(value: string) => {
            const isValid = workerShifts.some(
              (s: IWorkerShifts) =>
                new Date(s.shift_date).toDateString() ===
                new Date(value).toDateString(),
            );
            return isValid
              ? undefined
              : "Цей працівник не працює у вибраний день";
          }}
        />
        <ErrorMessage
          name="appointment_date"
          component="div"
          className="text-red-500 text-lg w-full"
        />
      </div>

      {selectedDate && (
        <div className="mx-5 mt-4 text-gray-400 hover:border-gray-900">
          <label className="block mb-1 text-lg text-gray-200">
            {t("Час операції")}
          </label>
          <select
            className="w-full p-2 border border-gray-400 rounded"
            onChange={(e) => {
              const selectedTime = e.target.value;
              if (!selectedTime) return;

              const [hours, minutes] = selectedTime.split(":");
              const dateObj = new Date(selectedDate);
              dateObj.setHours(Number(hours), Number(minutes), 0, 0);

              setFieldValue("appointment_date", dateObj);
            }}
          >
            <option value="">{t("Оберіть час")}</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
