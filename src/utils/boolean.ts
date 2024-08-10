export function toBoolean(e: any) {
  if (typeof e === "boolean") return e;
  if (typeof e === "string") return e === "true" || e === "1";
  return false;
}
