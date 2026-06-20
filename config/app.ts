import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "1.5.0",
  description: brandConfig.metadataDescription,
} as const;
