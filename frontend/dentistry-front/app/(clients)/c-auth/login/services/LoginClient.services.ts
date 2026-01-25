import { ILoginClient } from "../interfaces/LoginClient.interface";

export async function LoginClient(values: ILoginClient) {
  const mainApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const endApiUrl= '/auth/login'
  const response = await fetch(`${mainApiUrl}${endApiUrl}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.message || "Помилка авторизації");
  }
  return response.json();
}
