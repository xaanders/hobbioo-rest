import { Request, Response } from "express"

export type HttpRequest = {
    body: any;
    query: any;
    params: any;
    ip: string;
    method: string;
    path: string;
    headers: any;
}

export function makeExpressCallback (controller: any) {
    return (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip || '',
        method: req.method,
        path: req.path,
        headers: {
          'Content-Type': req.get('Content-Type'),
          Referer: req.get('referer'),
          'User-Agent': req.get('User-Agent')
        }
      }
      controller(httpRequest)
        .then((httpResponse: any) => {
          if (httpResponse.headers) {
            res.set(httpResponse.headers)
          }
          res.type('json')
          res.status(httpResponse.statusCode).send(httpResponse.body)
        })
        .catch((e: any) => res.status(500).send({ error: 'An unkown error occurred.' }))
    }
  }