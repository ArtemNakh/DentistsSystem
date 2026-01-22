import { ErrorMessage, Field } from "formik";

export default function BloodGroupRegistrationClientField() {
  return (
    <>
      <div className="mx-5  text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">Blood Group</label>
        <Field
          id="blood_group"
          name="blood_group"
          type="number"
          min={1}
          max={4}
          step={1}
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder="Enter blood group (1–4)"
        />
        <ErrorMessage
          name="blood_group"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
