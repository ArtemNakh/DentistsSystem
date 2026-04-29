import * as Yup from "yup";
export const CreateWorkerShiftSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    workerId: Yup.number().required(
      t("doctor.workers_shifts.adding_new_shift.validation_error.id_worker_need"),
    ),
    shift_date: Yup.date()
      .required(
        t("doctor.workers_shifts.adding_new_shift.validation_error.date_must_be"),
      )
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        t("doctor.workers_shifts.adding_new_shift.validation_error.date_not_past"),
      ),
    start_time: Yup.string().required(
      t("doctor.workers_shifts.adding_new_shift.validation_error.time_start_must_be"),
    ),
    end_time: Yup.string()
      .required(
        t("doctor.workers_shifts.adding_new_shift.validation_error.time_end_must_be"),
      )
      .test(
        "is-greater",
        t("doctor.workers_shifts.adding_new_shift.validation_error.time_end_early_start"),
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
