// Сервісна функція
export async function MailVerificationService(token: string | null) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/email-confirmation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (response.ok) {
      console.log("verification success");
      return { ok: true };
    } else {
      console.log("verification failed");
      return { ok: false };
    }
  } catch (error) {
    console.log("error mail verification", error);
    return { ok: false, error };
  }
}
