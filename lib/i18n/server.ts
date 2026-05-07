import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, type Lang } from "./languages";

export const LANG_COOKIE = "lang";

export async function readLangFromCookies(): Promise<Lang> {
  const stored = (await cookies()).get(LANG_COOKIE)?.value ?? null;
  return isLang(stored) ? stored : DEFAULT_LANG;
}
