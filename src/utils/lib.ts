import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { TRPCError } from "@trpc/server";
import { error } from "console";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any>{
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
export async function getSession(req: NextApiRequest) {
  const session = req.cookies["auth-token"];
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextApiRequest) {
  const session = request.cookies["auth-token"];
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "auth-token",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}