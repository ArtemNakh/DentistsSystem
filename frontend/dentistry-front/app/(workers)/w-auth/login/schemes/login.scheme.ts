// validationSchemas.ts
import * as Yup from "yup";

const loginValidationSchema = Yup.object().shape({
  login: Yup.string()
    .required("error.loginWorker.loginfield.required")
    .min(5, "error.loginWorker.loginfield.min" + " 5")
    .max(100, "error.loginWorker.loginfield.max" + " 100"),

  password: Yup.string()
    .required("error.loginWorker.password.required")
    .min(5, "error.loginWorker.password.min" + " 5")
    .max(100, "error.loginWorker.password.max" + " 100"),
});

export default loginValidationSchema;
