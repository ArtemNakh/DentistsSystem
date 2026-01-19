
export async function loginWorker(values: { login: string; password: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/auth/loginWorker`, {
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
