interface ModalAddingNewAppointmentProps {
  onClose: () => void;
}

export default function ModalAddingNewAppointment({
  onClose,
}: ModalAddingNewAppointmentProps) {
  return (
    <>
      <div className="fixed inset-0  backdrop-brightness-30 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-2/3 h-2/3 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Нове призначення</h2>
          <p>Тут можна показати форму або деталі appointment.</p>

          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Закрити
          </button>
        </div>
      </div>
    </>
  );
}
