import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "1.2.5",
  description: brandConfig.metadataDescription,
} as const;
