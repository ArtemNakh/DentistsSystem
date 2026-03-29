import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalInfoRegistrationClientField({
  isOpen,
  onClose,
}: ModalProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const handleClose = () => {
    onClose();
    router.push("/c-auth/login");
  };
  return (
    <>
      <div>
        {isOpen && (
          <div className="  fixed inset-0 flex items-center justify-center ">
            <div className="border-2 border-gray-400 bg-gray-200 rounded-lg shadow-lg p-6 max-w-prose w-full">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                {t("registrationClient.modalInfo.success")}
              </h2>
              <p className="text-gray-700 mb-6">
                {t("registrationClient.modalInfo.nextStep")}
              </p>
              <button
                onClick={() => handleClose()}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-400"
              >
                {t("registrationClient.modalInfo.close")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
