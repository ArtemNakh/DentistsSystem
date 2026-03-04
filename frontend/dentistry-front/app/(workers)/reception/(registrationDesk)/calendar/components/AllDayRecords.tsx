import { IAppointment } from "@/lib/redux/modules/Appointments/Appointment.interface";
import { useState } from "react";
import AppointmentModal from "./ModalView/ModalShowFullAppointment/ModalShowFullAppointment";
import ModalAddingNewAppointment from "./ModalView/ModalAddingNewAppointment/ModalAddingNewAppointment";
import { useTranslation } from "react-i18next";
import RegistrationClientView from "./ModalView/RegistrationClient/RegistrationClient";

interface AllDayRecordsProps {
  appointments: IAppointment[];
  selectedDate: Date;
}

export default function AllDayRecords({
  appointments,
  selectedDate,
}: AllDayRecordsProps) {
  const { t } = useTranslation();
  const dayAppointments = appointments.filter(
    (a) =>
      new Date(a.appointment_date).toDateString() ===
      selectedDate.toDateString(),
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointment | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [showModalRegistrClient, setShowModalRegistrClient] = useState(false);

  //new
  // const dispatch = useDispatch();
  // const [formData, setFormData] = useState({
  //   name: "",
  //   surname: "",
  //   middle_name: "",
  //   birthdate: "1990-05-15",
  //   blood_resus: "plus",
  //   blood_group: 2,
  //   phone: "+1234567890",
  //   allergic_diseases: "peanuts",
  //   email: "john.doe@example.com",
  //   password: "StrongPass123",
  //   passwordRepeat: "StrongPass123",
  // });
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   dispatch(AddClient(formData)); // 🔥 відправляємо DTO у Redux
  // };
  return (
    <>
      <div className="w-60 border border-gray-400 bg-linear-to-r from-[#874FD1] to-[#7562A5] flex flex-col h-full">
        {/* button for adding new appointment */}
        <div className="">
          <button
            onClick={() => setShowModal(true)}
            className="border border-gray-400 m-2 px-2 py-1 hover:bg-[#7D4DBF] active:bg-[#6C43A6]"
          >
            <img
              src="/new_appointment.png"
              alt="icon registration client"
              className="w-6 h-6"
            />{" "}
            {/* {t("reception.calendar.add_new_appointment")} */}
          </button>

          {showModal && (
            <ModalAddingNewAppointment onClose={() => setShowModal(false)} />
          )}
          {/* Button for show modal registration client */}
          <button
            onClick={() => setShowModalRegistrClient(true)}
            className="border border-gray-400 m-2 px-2 py-1 hover:bg-[#7D4DBF] active:bg-[#6C43A6]"
          >
            <img
              src="/new_client.png"
              alt="icon registration client"
              className="w-6 h-6"
            />
            {/* {t("reception.calendar.add_new_client")} */}
          </button>
          {showModalRegistrClient && (
            <RegistrationClientView
              onClose={() => setShowModalRegistrClient(false)}
            />
          )}
        </div>
        <div
          className="flex-1 p-4   overflow-auto scrollbar-thin
                scrollbar-thumb-[#7D4DBF] scrollbar-track-[#6F6697]"
        >
          <h2 className="text-base font-bold mb-2">
            {t("reception.calendar.records_on")}{" "}
            {selectedDate.toLocaleDateString()}
          </h2>
          {dayAppointments.length > 0 ? (
            <ul className="list-disc pl-5">
              {dayAppointments.map((a) => {
                const time = new Date(a.appointment_date).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );
                return (
                  <li
                    key={a.id}
                    className="border border-gray-400 p-1 my-2"
                    onClick={() => setSelectedAppointment(a)}
                  >
                    {time} – {a.dentist?.surname} {a.dentist?.name}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>{t("reception.calendar.no_records_day")}</p>
          )}
        </div>
        {/* Модальне вікно із усіма данними appointment*/}
        {selectedAppointment && (
          <AppointmentModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </div>
    </>
  );
}
