import * as Yup from "yup";

export const CreateOperationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    name: Yup.string()
      .required(t("admins.operation_list.schema.createOperation.name_must")),
    description: Yup.string()
      .required(t("admins.operation_list.schema.createOperation.description_must")),
    price: Yup.number()
      .typeError(t("admins.operation_list.schema.createOperation.price_number"))
      .positive(t("admins.operation_list.schema.createOperation.price_positive"))
      .required(t("admins.operation_list.schema.createOperation.price_must")),
    active: Yup.boolean()
      .optional(),
  });
