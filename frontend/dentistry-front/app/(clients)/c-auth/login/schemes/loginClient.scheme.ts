// validationSchemas.ts
import * as Yup from "yup";
import { ILoginClient } from "../interfaces/LoginClient.interface";

const loginClientValidationSchema: Yup.ObjectSchema<ILoginClient> = Yup.object().shape({
  email: Yup.string()
    .required("Require login")
    .min(5, "minimal 5 values")
    .max(100, "max 100")
    .email("must be email"),

  password: Yup.string()
    .required("require password")
    .min(5, "minimal 5 symbol")
    .max(100, "max 100 s"),
});

export default loginClientValidationSchema;
