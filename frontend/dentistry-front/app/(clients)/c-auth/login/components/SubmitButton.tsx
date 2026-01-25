import { useFormikContext } from "formik";
import { ILoginClient } from "../interfaces/LoginClient.interface";

export default function SubmitClientLoginButton() {
  const { isSubmitting } = useFormikContext<ILoginClient>();
  return (
    <>
      <div className="mx-5 mb-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border w-full border-gray-400 rounded p-2  text-gray-700 hover:bg-gray-300"
        >
          {isSubmitting ? "Зачекайте..." : "Увійти"}
        </button>
      </div>
    </>
  );
}
