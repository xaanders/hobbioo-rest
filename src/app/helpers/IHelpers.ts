export interface IHelpers {
  sanitize: (value: string) => string;
  generateId: () => string;
  logger: (message: string, type: "info" | "error" | "warn") => void;
  isProductionData: (developmentData: any, productionData: any) => any;
  getSettings: () => Settings;
}

export type Settings = {
  rateLimit: {
    maxRequests: number;
    timeWindowSec: number;
    ipWhitelist: string[];
  };
};
