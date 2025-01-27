import { Request, Response } from "express";
import { IHelpers } from "../app/helpers/IHelpers.js";
import { handleError } from "./error-handler.js";
import { Session } from "../app/auth/types.js";

export type HttpResponse = {
  headers?: Record<string, string>;
  statusCode: number;
  body: any;
};

export type HttpRequest = {
  body: {
    user?: Session;
    [key: string]: any;
  };
  query: any;
  params: any;
  ip: string;
  method: string;
  path: string;
  headers: {
    Authorization?: string;
    "Content-Type"?: string;
    Referer?: string;
    "User-Agent"?: string;
  };
};

export type CallbackType = (controller: (httpRequest: HttpRequest) => Promise<HttpResponse>) => (req: Request, res: Response) => void;

export function makeExpressCallback(helpers: IHelpers) {
  return (controller: (httpRequest: HttpRequest) => Promise<HttpResponse>) => {
    return (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip || "",
        method: req.method,
        path: req.path,
        headers: {
          "Content-Type": req.get("Content-Type"),
          Referer: req.get("referer"),
          "User-Agent": req.get("User-Agent"),
          Authorization: req.get("Authorization"),
        },
      };
      controller(httpRequest)
        .then((httpResponse: HttpResponse) => {
          if (httpResponse.headers) {
            res.set(httpResponse.headers);
          }
          res.type("json");
          res.status(httpResponse.statusCode).send(httpResponse.body);
        })
        .catch((e: any) => {
          helpers.logger((e as Error).message || (e as string), "error");
          const error = handleError(e);
          res.status(error.statusCode).send(error.body);
        });
    };
  };
}
