import * as Yup from "yup";

export const updateOperationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    name: Yup.string()
      .required(t("admins.operation_list.schema.updateOperation.name_must")),
    description: Yup.string()
      .required(t("admins.operation_list.schema.updateOperation.description_must")),
    price: Yup.number()
      .typeError(t("admins.operation_list.schema.updateOperation.price_number"))
      .positive(t("admins.operation_list.schema.updateOperation.price_positive"))
      .required(t("admins.operation_list.schema.updateOperation.price_must")),
    status: Yup.boolean()
      .optional(),
  });
