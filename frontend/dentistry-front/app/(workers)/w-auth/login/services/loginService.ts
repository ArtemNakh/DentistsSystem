import i18n from "i18next";

export async function loginWorker(values: { login: string; password: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/auth/loginWorker`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const errData = await response.json();
    const translatedError =
      i18n.t(`error.login.${errData.message}`) || i18n.t("error.login.default");
    throw new Error(translatedError);
  }
  return response.json();
}
