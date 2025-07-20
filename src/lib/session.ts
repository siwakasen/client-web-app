"use server";
import { cookies } from "next/headers";
import { jwtDecode, JwtPayload } from "jwt-decode";

export async function createSession(token: string) {
  const decodedJsonToken: JwtPayload = jwtDecode(token);
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: true,
    expires: new Date(decodedJsonToken.exp! * 1000),
    sameSite: "lax",
    path: "/",
  });
}

export async function getToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  return token;
}

export async function deleteSession() {
  "use server";
  console.log("delete session");
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return {
    message: "Session deleted successfully",
  };
}
