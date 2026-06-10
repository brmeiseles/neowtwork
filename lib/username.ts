const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{2,29}$/;

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function isValidUsername(username: string) {
  return USERNAME_PATTERN.test(username);
}

export function getUsernameHelpText() {
  return "Use 3-30 lowercase letters, numbers, underscores, or hyphens. Start with a letter or number.";
}
