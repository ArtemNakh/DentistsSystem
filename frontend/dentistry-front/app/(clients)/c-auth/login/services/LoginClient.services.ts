import { ILoginClient } from "../interfaces/LoginClient.interface";
import i18n from "i18next";

export async function LoginClient(values: ILoginClient) {
  const mainApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const endApiUrl = "/auth/login";
  const response = await fetch(`${mainApiUrl}${endApiUrl}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
    credentials: "include",
  });
  if (!response.ok) {
    const errData = await response.json();
    // errData.message може бути "Invalid email or password", "User not found" тощо
    const translatedError =
      i18n.t("error.loginClient.login.default");
    throw new Error(translatedError);
  }
  return response.json();
}
