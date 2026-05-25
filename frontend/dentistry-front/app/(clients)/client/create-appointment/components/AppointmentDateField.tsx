import { useAppSelector } from "@/lib/redux/hooks";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
import { RootState } from "@/lib/redux/store";
import { ErrorMessage, useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import { uk, enUS, Locale } from "date-fns/locale";
import i18n from "@/i18next.config";
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

const localeMap: Record<string, Locale> = {
  uk: uk,
  en: enUS,
};

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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Масив робочих днів
  const workingDays = useMemo(
    () => workerShifts.map((s: IWorkerShifts) => new Date(s.shift_date)),
    [workerShifts],
  );

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
          
            {t("client.create_appointment.date.date_operation")}
        </label>

        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            setSelectedDate(date);
            if (date) setFieldValue("appointment_date", date);
          }}
          locale={localeMap[i18n.language]}
          includeDates={workingDays}
          inline
          dayClassName={(date) =>
            workingDays.some((d) => d.toDateString() === date.toDateString())
              ? "bg-yellow-200 text-gray-900 rounded-full"
              : "text-gray-400"
          }
          placeholderText=
            {t("client.create_appointment.date.choose_date")}
        />
        <ErrorMessage
          name="appointment_date"
          component="div"
          className="text-red-500 text-lg w-full"
        />
      </div>

      {selectedDate && (
        <div className="mx-5 mt-4 text-gray-400 hover:border-gray-900">
          <label className="block mb-1 text-lg text-gray-700">
            {t("client.create_appointment.date.time_operation")}
          </label>
          <select
            className="w-full p-2 border border-gray-400 rounded text-gray-600 "
            onChange={(e) => {
              const selectedTime = e.target.value;
              if (!selectedTime) return;

              const [hours, minutes] = selectedTime.split(":");
              const dateObj = new Date(selectedDate);
              dateObj.setHours(Number(hours), Number(minutes), 0, 0);
              setFieldValue("appointment_date", new Date(selectedDate));
            }}
          >
            <option value=""> {t("client.create_appointment.date.choose_time")}</option>
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
