import { createHmac, timingSafeEqual } from "node:crypto";
export type ImageSubject = {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
};
export function createImageTicket(recipe: ImageSubject, key: string) {
  const payload = Buffer.from(
    JSON.stringify({
      ...recipe,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }),
  ).toString("base64url");
  return (
    payload +
    "." +
    createHmac("sha256", key).update(payload).digest("base64url")
  );
}
export function readImageTicket(
  ticket: string,
  key: string,
): ImageSubject | null {
  try {
    const [payload, signature, ...extra] = ticket.split(".");
    if (extra.length || !payload || !signature) return null;
    const expected = createHmac("sha256", key).update(payload).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return null;
    const r = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (
      typeof r.id !== "string" ||
      typeof r.name !== "string" ||
      !Array.isArray(r.ingredients) ||
      !r.ingredients.every((s: unknown) => typeof s === "string") ||
      !Array.isArray(r.instructions) ||
      r.expires < Date.now()
    )
      return null;
    return r;
  } catch {
    return null;
  }
}
