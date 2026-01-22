import { IRegisterClient } from "../interfaces/RegisterClient.interface";

export async function RegistrationClient(values: IRegisterClient) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/auth/registration`, {
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
