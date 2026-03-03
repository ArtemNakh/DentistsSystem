import { useAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { IClient } from "@/lib/redux/modules/Clients/clients.interface";
import { IDentistry } from "@/lib/redux/modules/Dentistries/Dentistry.interface";
import { ISpecialty } from "@/lib/redux/modules/Specialties/Specialties.interface";
import { IWorker } from "@/lib/redux/modules/Workers/Workers.interface";
import { RootState } from "@/lib/redux/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectBusyDoctors = createSelector(
  [
    (state: RootState) => state.appointments, // всі прийоми
    (state: RootState) => state.clients, // всі клієнти
    (state: RootState) => state.workers, // всі лікарі
    (state: RootState) => state.specialties, // всі спеціалізації
    (state: RootState) => state.dentistries, // всі стоматології
  ],
  (appointmentsObj, clientsObj, workersObj, specialtiesObj, dentistriesObj) => {
    const now = new Date();
    const appointments: IAppointment[] = Object.values(appointmentsObj ?? {});
    const clients: IClient[] = Object.values(clientsObj ?? {});
    const workers: IWorker[] = Object.values(workersObj ?? {});
    const specialties: ISpecialty[] = Object.values(specialtiesObj ?? {});

    const dentistries: IDentistry[] = Object.values(dentistriesObj ?? {});
    return appointments // фільтруємо лише ті прийоми, які йдуть прямо зараз
      .filter((appt) => {
        const apptDate = new Date(appt.appointment_date); // приклад: якщо прийом триває 1 годину
        const apptEnd = new Date(apptDate.getTime() + 60 * 60 * 1000);
        return apptDate <= now && now <= apptEnd;
      })
      .map((appt) => {
        // знаходимо клієнта
        const client = clients.find(
          (c) => c.id === (appt.client as unknown as number),
        ); // знаходимо лікаря
        const doctor = workers.find(
          (w) => w.id === (appt.dentist as unknown as number),
        ); // знаходимо спеціалізацію лікаря
        const specialty = doctor
          ? specialties.find(
              (s) => s.id === (doctor.specialty as unknown as number),
            )
          : null; // знаходимо стоматологію лікаря
        const dentistry = doctor
          ? dentistries.find(
              (d) => d.id === (doctor.dentistry as unknown as number),
            )
          : null;
        return {
          ...appt,
          client: client ?? null,
          dentist: doctor ? { ...doctor, specialty, dentistry } : null,
        };
      });
  },
);

export default function TableBusyDoctors() {
  const operatingDoctors = useAppSelector(selectBusyDoctors);

  return (
    <>
      <div className="mt-8  border-2  border-gray-450 ">
        <div className="flex items-center justify-center my-2">
          <h2 className="text-base text-center  font-bold ">
            Лікарі, які зараз оперують
          </h2>
        </div>
        <div className="max-h-96 border-2 border-gray-400 overflow-y-auto">
          <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Доктор</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Спеціалізація
                </th>
                <th className="px-4 py-2 text-left font-semibold">Пацієнт</th>
              </tr>
            </thead>
            <tbody>
              {operatingDoctors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-200">
                    На сьогодні немає неоплачених операцій
                  </td>
                </tr>
              ) : (
                operatingDoctors.map((d, i) => (
                  <tr
                    key={i}
                    className="odd:bg-gray-50 even:bg-gray-100 hover:bg-purple-200 transition-colors"
                  >
                    <td className="px-4 py-2 text-gray-900">
                      {d.dentist?.name} {d.dentist?.surname}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {d.dentist?.specialty?.name}
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {d.client?.name} {d.client?.surname}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
