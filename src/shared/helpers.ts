/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const isDevelopment = (developmentData: any, productionData: any) => {
  return process.env.NODE_ENV === "development" ? developmentData : productionData;
};
