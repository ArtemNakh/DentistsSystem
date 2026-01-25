import { ErrorMessage, Field } from "formik";
import { useState } from "react";

export default function PasswordClientLoginField() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="mx-5 mb-5 text-gray-500 ">
        <label className="block mb-1 text-lg text-gray-700">Password</label>
        <div className="relative">
          <Field
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border border-gray-400 rounded focus:outline-none hover:border-gray-950 "
            placeholder="Введіть password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
          >
            {showPassword ? (
              <img
                src="/eye-open.svg"
                alt="Show password"
                className="h-5 w-5"
              />
            ) : (
              <img
                src="/eye-closed.svg"
                alt="Hide password"
                className="h-5 w-5"
              />
            )}
          </button>
        </div>
        <ErrorMessage
          name="password"
          component="div"
          className=" text-red-500  text-lg"
        />
      </div>
    </>
  );
}
