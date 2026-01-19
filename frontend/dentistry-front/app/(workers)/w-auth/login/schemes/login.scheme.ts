// validationSchemas.ts
import * as Yup from "yup";

const loginValidationSchema = Yup.object().shape({
  login: Yup.string()
    .required("Require login")
    .min(5, "minimal 5 values")
    .max(100, "max 100"),

  password: Yup.string()
    .required("require password")
    .min(5, "minimal 5 symbol")
    .max(100, "max 100 s"),
});

export default loginValidationSchema;
