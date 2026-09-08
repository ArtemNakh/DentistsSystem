// export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
// export const SESSION_EXPIRY_KEY = "sessionExpiry";


export const SESSION_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT_MS);
export const SESSION_EXPIRY_KEY = process.env.NEXT_PUBLIC_SESSION_EXPIRY_KEY ?? "sessionExpiry";

export const getSessionExpiry = (): number | null => {
  const value = localStorage.getItem(SESSION_EXPIRY_KEY);
  const expiry = value ? Number(value) : null;
  return Number.isFinite(expiry) ? expiry : null;
};

export const setSessionExpiry = () => {
  localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_TIMEOUT_MS));
};

export const clearSessionExpiry = () => {
  localStorage.removeItem(SESSION_EXPIRY_KEY);
};
