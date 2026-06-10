import { brandConfig } from "@/config/brand";

export const appConfig = {
  name: brandConfig.appName,
  version: "1.3.1",
  description: brandConfig.metadataDescription,
} as const;
