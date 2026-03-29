import { Field } from "formik";

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean | undefined>;
}

// Поле форми з валідацією
export default function FormField({ label, name, type, errors, touched }: FormFieldProps) {
  return (
    <div className="mb-2">
      <label className="text-sm font-medium">{label}</label>
      <Field
        type={type}
        name={name}
        className="border p-2 w-full"
      />
      {errors[name] && touched[name] && (
        <div className="text-red-500 text-sm">{errors[name]}</div>
      )}
    </div>
  );
}
