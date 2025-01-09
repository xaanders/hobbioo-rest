import { Request, Response } from "express";
import logger from "../logger/index.js";

export type HttpResponse = {
  headers?: Record<string, string>;
  statusCode: number;
  body: any;
};

export type HttpRequest = {
  body: any;
  query: any;
  params: any;
  ip: string;
  method: string;
  path: string;
  headers: any;
};

export function makeExpressCallback(
  controller: (httpRequest: HttpRequest) => Promise<HttpResponse>
) {
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
        logger.error("Unknown error in makeExpressCallback:", e);
        res.status(500).send({ error: "An unkown error occurred." });
      });
  };
}
