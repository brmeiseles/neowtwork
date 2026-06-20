"use client";

import posthog from "posthog-js";
import { appConfig } from "@/config/app";
import type { PublicEnv } from "@/lib/env";

type AnalyticsEventName =
  | "achievement_viewed"
  | "completion_added"
  | "seed_copied"
  | "friend_added"
  | "profile_viewed"
  | "board_link_copied"
  | "board_followed"
  | "follow_back_clicked";

type AnalyticsProperties = Record<
  string,
  boolean | number | string | null | undefined
>;

let isAnalyticsReady = false;

export function configureAnalytics(env: PublicEnv) {
  if (isAnalyticsReady || !env.posthogKey || !env.posthogHost) {
    return;
  }

  posthog.init(env.posthogKey, {
    api_host: env.posthogHost,
    autocapture: false,
    capture_pageleave: false,
    capture_pageview: false,
    disable_session_recording: true,
    person_profiles: "identified_only",
  });
  isAnalyticsReady = true;
}

export function captureAnalyticsEvent(
  eventName: AnalyticsEventName,
  properties: AnalyticsProperties = {},
) {
  if (!isAnalyticsReady) {
    return;
  }

  posthog.capture(eventName, {
    app_version: appConfig.version,
    ...properties,
  });
}
