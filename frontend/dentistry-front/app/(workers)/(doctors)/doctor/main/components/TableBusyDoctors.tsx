import { TestuseAppSelector, useAppSelector } from "@/lib/redux/hooks";
import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { AppointmentEntity } from "@/lib/redux/modules/Appointments/Appointments.Entity";
import { RootState } from "@/lib/redux/store";
import { denormalize } from "normalizr";
import { useTranslation } from "react-i18next";


export default function TableBusyDoctors() {
  const { t } = useTranslation();



// vER1
  // беремо весь state як entities
//   const entities = useAppSelector((state: [IAppointment]) => state.appointments);
// console.log("Entities",entities)
//   // отримуємо всі appointments денормалізовані
//   const appointments = Object.keys(entities.appointments ?? {})
//     .map((id) => denormalize(Number(id), AppointmentEntity.schema, entities))
//     .filter(Boolean);

// const appointments = useAppSelector((state: IAppointment[]) => state.appointments);
const appointments = TestuseAppSelector<IAppointment[]>(
  (state) => state.appointments
);

console.log("appointmentsqwe", appointments);




  const now = new Date();

  // фільтруємо лише ті прийоми, які йдуть прямо зараз
  const operatingDoctors = appointments.filter((appt) => {
    const apptDate = new Date(appt.appointment_date);
    const apptEnd = new Date(apptDate.getTime() + 60 * 60 * 1000);
    return apptDate <= now && now <= apptEnd;
  });

  console.log("Busy doctors:", operatingDoctors);


  // const operatingDoctors = useAppSelector(selectBusyDoctors);
console.log("operDoctor",operatingDoctors)
  return (
    <>
      <div className="mt-8  border-2  border-gray-450 ">
        <div className="flex items-center justify-center my-2">
          <h2 className="text-base text-center  font-bold ">
            {t("reception.main.busy_doctors.name")}
          </h2>
        </div>
        <div className="max-h-96 border-2 border-gray-400 overflow-y-auto">
          <table className="min-w-full border-collapse rounded-lg shadow-lg overflow-hidden">
            <thead className="bg-linear-to-r from-[#874FD1] to-[#6F6697] text-white">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">
                  {t("reception.main.busy_doctors.table.doctor")}
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  {t("reception.main.busy_doctors.table.specialization")}
                </th>
                <th className="px-4 py-2 text-left font-semibold">
                  {t("reception.main.busy_doctors.table.patient")}
                </th>
              </tr>
            </thead>
            <tbody>
              {operatingDoctors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-200">
                    {t("reception.main.busy_doctors.today_wthout_busy_doctor")}
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
