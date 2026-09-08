import i18n from "@/i18next.config";
import * as Yup from "yup";

export const CreateWorkerShiftSchema = Yup.object().shape({
  workerId: Yup.number().required(
   () => i18n.t(
      "admins.workers_shifts.adding_new_shift.schema_adding.worker_id_must",
    ),
  ),

  shift_date: Yup.date()
    .required(
     () => i18n.t("admins.workers_shifts.adding_new_shift.schema_adding.date_must"),
    )
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
    () =>  i18n.t(
        "admins.workers_shifts.adding_new_shift.schema_adding.date_not_past",
      ),
    ),

  start_time: Yup.string().required(
    () =>i18n.t(
      "admins.workers_shifts.adding_new_shift.schema_adding.start_time_must",
    ),
  ),

  end_time: Yup.string()
    .required(
     () => i18n.t(
        "admins.workers_shifts.adding_new_shift.schema_adding.end_time_must",
      ),
    )
    .test(
      "is-greater",
     () => i18n.t(
        "admins.workers_shifts.adding_new_shift.schema_adding.match_start_end_time",
      ),
      function (value) {
        const { start_time } = this.parent;
        if (!start_time || !value) return true;

        const [startHour, startMinute] = start_time.split(":").map(Number);
        const [endHour, endMinute] = value.split(":").map(Number);

        const start = new Date(0, 0, 0, startHour, startMinute);
        const end = new Date(0, 0, 0, endHour, endMinute);

        return end > start;
      },
    ),
});
