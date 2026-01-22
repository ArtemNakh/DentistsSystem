import { ErrorMessage, Field } from "formik";

export default function AllergicDiseasesRegistrationClientField() {
  return (
    <>
      <div className="mx-5  text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">
          Allergic Diseases
        </label>
        <Field
          id="allergic_diseases"
          name="allergic_diseases"
          type="text"
          maxLength={255}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder="Enter allergic diseases"
        />
        <ErrorMessage
          name="allergic_diseases"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
