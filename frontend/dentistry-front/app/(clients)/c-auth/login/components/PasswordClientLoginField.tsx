import { ErrorMessage, Field } from "formik";

export default function PasswordClientLoginField() {
  return (
    <>
      <div className="mx-5 mb-5 text-gray-500 ">
        <label className="block mb-1 text-lg text-gray-700">Password</label>
        <Field
          id="password"
          name="password"
          type="password"
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950 "
          placeholder="Введіть password"
        />
        <ErrorMessage
          name="password"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
