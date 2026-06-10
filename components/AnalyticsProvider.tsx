"use client";

import { useEffect } from "react";
import { configureAnalytics } from "@/lib/analytics";
import type { PublicEnv } from "@/lib/env";

type AnalyticsProviderProps = {
  publicEnv: PublicEnv;
};

export function AnalyticsProvider({ publicEnv }: AnalyticsProviderProps) {
  useEffect(() => {
    configureAnalytics(publicEnv);
  }, [publicEnv]);

  return null;
}
