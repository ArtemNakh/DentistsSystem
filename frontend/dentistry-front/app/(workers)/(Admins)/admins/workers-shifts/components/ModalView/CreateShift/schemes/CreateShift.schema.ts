import * as Yup from "yup";

export const CreateWorkerShiftSchema = Yup.object().shape({
  workerId: Yup.number().required("ID працівника обовʼязковий"),

  shift_date: Yup.date()
    .required("Дата зміни обовʼязкова")
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)), 
      "Дата не може бути в минулому"
    ),

  start_time: Yup.string()
    .required("Час початку обовʼязковий"),

  end_time: Yup.string()
    .required("Час завершення обовʼязковий")
    .test(
      "is-greater",
      "Час завершення повинен бути пізніше за час початку",
      function (value) {
        const { start_time } = this.parent;
        if (!start_time || !value) return true;

        const [startHour, startMinute] = start_time.split(":").map(Number);
        const [endHour, endMinute] = value.split(":").map(Number);

        const start = new Date(0, 0, 0, startHour, startMinute);
        const end = new Date(0, 0, 0, endHour, endMinute);

        return end > start;
      }
    ),
});
