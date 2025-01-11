export interface IHelpers {
  sanitize: (value: string) => string;
  generateId: () => string;
  logger: (message: string, type: "info" | "error" | "warn") => void;
  isProductionData: (developmentData: any, productionData: any) => any;
}
