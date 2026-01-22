import { ErrorMessage, Field } from "formik";

export default function MiddleNameRegistrationClientField() {
  return (
    <>
      <div className="mx-5  text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">Middle name</label>

        <Field
          id="middle_name"
          name="middle_name"
          type="text"
          maxLength={100}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950 "
          placeholder="Enter middle name"
        />
        <ErrorMessage
          name="middle_name"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
