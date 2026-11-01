/**
 * Django (Render) serveriga murojaat qilish uchun umumiy sozlama.
 * Manzil .env.local (lokal) va Vercel Environment Variables (internet) dan olinadi:
 *   VITE_API_URL=https://sizning-server.onrender.com
 */
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

// Oxiridagi "/" belgilari olib tashlanadi
export const API_URL: string = (env?.VITE_API_URL ?? '').replace(/\/+$/, '');

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API xatosi: ${res.status}`);
  return (await res.json()) as T;
}