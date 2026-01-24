import { ErrorMessage, Field } from "formik";

export default function EmailClientLoginField() {
  return (
    <>
      <div className="mx-5   text-gray-700 mb-3 ">
        <label className="block mb-1 text-lg ">Email</label>
        <Field
          id="email"
          name="email"
          type="email"
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950 "
          placeholder="Введіть email"
        />
        <ErrorMessage
          name="email"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
