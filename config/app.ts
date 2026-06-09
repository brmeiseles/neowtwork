import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "0.1.3",
  description: brandConfig.metadataDescription,
} as const;
