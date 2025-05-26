import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function signToken(payload: JWTPayload, expiresIn = "7d"): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
