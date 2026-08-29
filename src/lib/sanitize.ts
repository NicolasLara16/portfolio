const TAG_RE = /<[^>]*>?/g;

export function sanitizeText(value: string): string {
  return value.replace(TAG_RE, "").replace(/\s+/g, " ").trim();
}

export function sanitizeMultiline(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(TAG_RE, "").replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeUrl(value: string): string {
  const raw = value.trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => sanitizeText(tag))
    .filter(Boolean)
    .slice(0, 12);
}
