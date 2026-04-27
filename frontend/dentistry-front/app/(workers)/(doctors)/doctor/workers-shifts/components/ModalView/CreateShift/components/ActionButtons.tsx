import { useTranslation } from "react-i18next";

type ActionButtonsProps = {
  onClose: () => void;
};

export default function ActionButtons({ onClose }: ActionButtonsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end gap-2">
      <button
        type="submit"
        className="text-gray-200 px-4 py-2 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
      >
        {t("doctor.workers_shifts.adding_new_shift.save")}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 border text-gray-200 rounded bg-[#7A5EB2] hover:bg-[#674F96]"
      >
        {t("doctor.workers_shifts.adding_new_shift.cancelled")}
      </button>
    </div>
  );
}
