import { useFormikContext } from "formik";

export default function SubmitClientRegistrationButton() {
  const { isSubmitting } = useFormikContext<{
    email: string;
    password: string;
  }>();
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
