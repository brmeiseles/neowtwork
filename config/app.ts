import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "1.3.7",
  description: brandConfig.metadataDescription,
} as const;
