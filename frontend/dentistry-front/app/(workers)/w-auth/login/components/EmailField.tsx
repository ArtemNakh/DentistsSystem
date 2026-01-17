import { ErrorMessage, Field } from "formik";

export default function EmailField() {
  return (
    <div className=" text-gray-300 ">
      <label className="block mb-1 ">Email</label>
      <Field
        id="email"
        name="email"
        type="email"
        className="w-full p-2 border rounded focus:outline-none hover:border-gray-100 "
        placeholder="Введіть email"
      />
      <ErrorMessage
        name="email"
        component="div"
        className=" text-red-500  text-lg"
      />
    </div>
  );
}
