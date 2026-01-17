// validationSchemas.ts
import * as Yup from "yup";

const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Requere email")
    .email("must be email")
    .min(5, "minimal 5 values")
    .max(100, "max 100"),

  password: Yup.string()
    .required("require password")
    .min(5, "minimal 5 symbol")
    .max(100, "max 100 s"),
});

export default loginValidationSchema;
