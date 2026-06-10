import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "0.2.0",
  description: brandConfig.metadataDescription,
} as const;
