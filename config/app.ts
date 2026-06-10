import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "0.2.2",
  description: brandConfig.metadataDescription,
} as const;
