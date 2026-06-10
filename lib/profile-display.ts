type DisplayProfile = {
  display_name: string | null;
  username: string;
};

export function getProfileDisplayName(profile: DisplayProfile) {
  return profile.display_name?.trim() || profile.username;
}
