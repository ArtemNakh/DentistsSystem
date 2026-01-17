import { useFormikContext } from "formik";

export default function SubmitButton() {
  const { isSubmitting } = useFormikContext<{
    email: string;
    password: string;
  }>();
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="border hover:bg-soft-purple-7 border-gray-300 rounded p-2"
    >
      {isSubmitting ? "Зачекайте..." : "Увійти"}
    </button>
  );
}
