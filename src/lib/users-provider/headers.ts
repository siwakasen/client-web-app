import { headers } from "next/headers";

export async function getHeaders() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const ip = headersList.get("x-forwarded-for") || "";
  const header: Record<string, string> = {
    "User-Agent": userAgent || "",
    "X-Forwarded-For": ip || "",
  };
  return header;
}
