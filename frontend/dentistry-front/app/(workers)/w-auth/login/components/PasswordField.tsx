import { ErrorMessage, Field } from "formik";

export default function PasswordField() {
  return (
    <div className=" text-gray-300">
      <label className="block mb-1">Пароль</label>
      <Field
        id="password"
        name="password"
        type="password"
        className="w-full p-2 border rounded focus:outline-none hover:border-gray-100"
        placeholder="Введіть пароль"
      />
      <ErrorMessage
        name="password"
        component="div"
        className="text-red-500 text-lg"
      />
    </div>
  );
}
