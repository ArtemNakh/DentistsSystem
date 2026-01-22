import { ErrorMessage, Field } from "formik";

export default function EmailRegistrationClientField() {
  return (
    <>
      <div className="mx-5 text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">Email</label>
        <Field
          id="email"
          name="email"
          type="email"
          maxLength={100}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder="Enter email"
        />
        <ErrorMessage
          name="email"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
