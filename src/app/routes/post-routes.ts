import { NextFunction, Router, Request, Response } from "express";
import { IHelpers } from "../helpers/IHelpers.js";
import { IPostRepository } from "../../gateways/post-repository.js";
import { createPost } from "../../use-cases/post/create-post.js";
import { makeExpressCallback } from "../../express/callback.js";
import { createPostController, getPostController } from "../../controllers/post-controller.js";
import { getPost } from "../../use-cases/post/get-post.js";

const makePostRoutes = (
  postRepository: IPostRepository,
  helpers: IHelpers,
  rateLimitMiddleware: (req: Request, res: Response, next: NextFunction) => void,
  authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  const router = Router();
  const expressCallback = makeExpressCallback(helpers);

  const createPostFlow = createPost({ postRepository, helpers });

  const getPostFlow = getPost({ postRepository });
  const postPostHandler = createPostController(createPostFlow);
  const getPostHandler = getPostController(getPostFlow);

  router.post("/", authMiddleware, rateLimitMiddleware, expressCallback(postPostHandler));

  router.get("/:id", authMiddleware, rateLimitMiddleware, expressCallback(getPostHandler));

  return router;
};

export default makePostRoutes;
