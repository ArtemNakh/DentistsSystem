import { ErrorMessage, Field } from "formik";
import { useState } from "react";

export default function PasswordRepeatRegistrationClientField() {
  const [showPassword,setShowPassword] = useState(false)
  return (
    <>
      <div className="mx-5  text-gray-500">
        <label className="block mb-1 text-lg text-gray-700">
          Repeat Password
        </label>
        <div className="relative">
        <Field
          id="passwordRepeat"
          name="passwordRepeat"
          type="password"
          className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950"
          placeholder="Repeat password"
        />
         {/* Кнопка для перемикання */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 text-sm text-gray-600 hover:text-gray-900"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          </div>
        <ErrorMessage
          name="passwordRepeat"
          component="div"
          className="text-red-500 text-lg"
        />
      </div>
    </>
  );
}
