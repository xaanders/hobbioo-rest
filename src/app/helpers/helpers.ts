import sanitize from "sanitize-html";
import logger from "./logger.js";
import { IHelpers, Settings } from "./IHelpers.js";
import fs from "fs";

const settings = JSON.parse(fs.readFileSync('settings.json', 'utf8')) as Settings;

export const helpers: IHelpers = {
  generateId: () => {
    return crypto.randomUUID();
  },
  sanitize: (text: string) => {
    return sanitize(text, {
      allowedTags: [],
      allowedAttributes: {},
    });
  },
  logger: (message: string, type: "info" | "error" | "warn") => {
    logger[type](message);
  },
  isProductionData: (developmentData: any, productionData: any): any => {
    return process.env.NODE_ENV === "production" ? productionData : developmentData;
  },
  getSettings: (): Settings => {
    return settings;
  }
};

