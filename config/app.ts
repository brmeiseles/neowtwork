import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "1.0.0",
  description: brandConfig.metadataDescription,
} as const;
