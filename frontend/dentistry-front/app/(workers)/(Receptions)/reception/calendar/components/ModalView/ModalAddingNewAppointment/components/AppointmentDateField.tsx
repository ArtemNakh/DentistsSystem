import i18n from "@/i18next.config";
import { useAppSelector } from "@/lib/redux/hooks";
import { IWorkerShifts } from "@/lib/redux/modules/WorkerShifts/WorkerShifts.interface";
import { RootState } from "@/lib/redux/store";
import { Locale } from "date-fns";
import { enUS, uk } from "date-fns/locale";
import { ErrorMessage, useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";

const localeMap: Record<string, Locale> = {
  uk: uk,
  en: enUS,
};
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
  const { setFieldValue, values } = useFormikContext<any>();
  const workerShiftsObj = useAppSelector(
    (state: RootState) => state.workerShifts,
  );

  const workerShifts = Array.isArray(workerShiftsObj)
    ? workerShiftsObj.filter((shift) => shift.worker.id === values.dentistId)
    : Object.values(workerShiftsObj ?? {});

  const appointmentsObj = useAppSelector(
    (state: RootState) => state.appointments,
  );
  const appointments = Array.isArray(appointmentsObj)
    ? appointmentsObj
    : Object.values(appointmentsObj ?? {});

  const [selectedTime, setSelectedTime] = useState<string>("");
  const [timeError, setTimeError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Масив робочих днів
  const workingDays = useMemo(() => {
    if (!values.dentistId) return [];
    return workerShifts.map((s: IWorkerShifts) => new Date(s.shift_date));
  }, [workerShifts,values.dentistId]);

  

  // Доступні години для вибраної дати
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];

    const shift = workerShifts.find(
      (s: any) =>
        new Date(s.shift_date).toDateString() === selectedDate.toDateString(),
    );
    if (!shift) return [];

    let times = generateHourlySlots(shift.start_time, shift.end_time);

    times = times.filter((time) => {
      const [slotHour] = time.split(":").map(Number);

      const isBusy = appointments.some((a: any) => {
        const appointmentDate = new Date(a.appointment_date);
        return (
          appointmentDate.toDateString() === selectedDate.toDateString() &&
          appointmentDate.getHours() === slotHour &&
          appointmentDate.getMinutes() === 0
        );
      });

      return !isBusy;
    });

    return times;
  }, [selectedDate, workerShifts, appointments]);

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);

    if (!time) {
      // якщо користувач вибрав "невизначено"
      setTimeError(
        t(
          "reception.calendar.modal.adding_appointment.appointment_date.choose_time",
        ),
      );
      // очищаємо значення у Formik
      setFieldValue("appointment_date", "");
      return;
    }

    setTimeError(null);

    const [hours, minutes] = time.split(":");
    const dateObj = new Date(selectedDate!);
    dateObj.setHours(Number(hours), Number(minutes), 0, 0);

    setFieldValue("appointment_date", dateObj);
  };

  useEffect(() => {
    if (!values.appointment_date) {
      setSelectedDate(null);
      setSelectedTime("");
      setTimeError(null);
    }
  }, [values.appointment_date]);

  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-200">
          {t(
            "reception.calendar.modal.adding_appointment.appointment_date.title",
          )}
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
          dayClassName={(date) => {
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();
            const isWorkingDay = workingDays.some(
              (d) => d.toDateString() === date.toDateString(),
            );

            if (isSelected) {
              return `!bg-purple-500 !text-gray-100 rounded-full  hover:!rounded-full 
              hover:!bg-purple-200 hover:!text-gray-600 transition-colors !important`;
            }

            if (isWorkingDay) {
              return `bg-purple-300 text-gray-900 rounded-full  hover:!rounded-full 
              hover:!bg-purple-200 hover:!text-gray-600 transition-colors !important`;
            }
            return "text-gray-400 line-through hover:bg-gray-200 hover:text-black";
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
            {t(
              "reception.calendar.modal.adding_appointment.appointment_date.time_operation",
            )}
          </label>
          <select
            className="w-full p-2 border border-gray-400 rounded"
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
          >
            <option value="">
              {t(
                "reception.calendar.modal.adding_appointment.appointment_date.choose_time",
              )}
            </option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          {timeError && (
            <div className="mt-2 text-red-500 text-lg">{timeError}</div>
          )}
        </div>
      )}
    </>
  );
}
