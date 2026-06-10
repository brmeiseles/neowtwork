"use client";

import { useEffect } from "react";
import { captureAnalyticsEvent } from "@/lib/analytics";

type ProfileViewAnalyticsProps = {
  completionCount: number;
  isLoggedIn: boolean;
  viewedProfileType: "own" | "friend" | "public";
};

export function ProfileViewAnalytics({
  completionCount,
  isLoggedIn,
  viewedProfileType,
}: ProfileViewAnalyticsProps) {
  useEffect(() => {
    captureAnalyticsEvent("profile_viewed", {
      completion_count: completionCount,
      is_logged_in: isLoggedIn,
      source: "profile",
      viewed_profile_type: viewedProfileType,
    });
  }, [completionCount, isLoggedIn, viewedProfileType]);

  return null;
}
