const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{2,29}$/;
const USERNAME_MAX_LENGTH = 30;

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string) {
  return USERNAME_PATTERN.test(username);
}

export function createUsernameSlugFromText(text: string, fallback: string) {
  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, USERNAME_MAX_LENGTH)
    .replace(/[-_]+$/g, "");

  if (isValidUsername(slug)) {
    return slug;
  }

  return normalizeUsername(fallback)
    .replace(/[^a-z0-9_-]+/g, "-")
    .slice(0, USERNAME_MAX_LENGTH)
    .replace(/[-_]+$/g, "");
}

export function appendUsernameSlugSuffix(slug: string, suffix: string) {
  const cleanSuffix = suffix
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  const separator = "-";
  const suffixText = `${separator}${cleanSuffix || "codex"}`;
  const prefix = slug
    .slice(0, USERNAME_MAX_LENGTH - suffixText.length)
    .replace(/[-_]+$/g, "");

  return `${prefix}${suffixText}`;
}
