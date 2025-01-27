import { NextFunction, Router, Request, Response } from "express";
import { IHelpers } from "../helpers/IHelpers.js";
import { IPostRepository } from "../../gateways/post-repository.js";
import { createPost } from "../../use-cases/post/create-post.js";
import { CallbackType } from "../../express/callback.js";
import { createPostController, deletePostController, getPostController, getPostsController, updatePostController } from "../../controllers/post-controller.js";
import { getPost } from "../../use-cases/post/get-post.js";
import { getAllPosts } from "../../use-cases/post/get-all-posts.js";
import { updatePost } from "../../use-cases/post/update-post.js";
import { deletePost } from "../../use-cases/post/delete-post.js";

const makePostRoutes = (
  postRepository: IPostRepository,
  helpers: IHelpers,
  rateLimitMiddleware: (req: Request, res: Response, next: NextFunction) => void,
  authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  expressCallback: CallbackType
) => {
  const router = Router();

  // Compose the use cases
  const createPostFlow = createPost({ postRepository, helpers });
  const updatePostFlow = updatePost({ postRepository, helpers });
  const getPostFlow = getPost({ postRepository });
  const getAllPostsFlow = getAllPosts({ postRepository });
  const deletePostFlow = deletePost(postRepository);

  // Initialize controllers
  const postPostHandler = createPostController(createPostFlow);
  const getPostHandler = getPostController(getPostFlow);
  const updatePostHandler = updatePostController(updatePostFlow);
  const getPostsHandler = getPostsController(getAllPostsFlow);
  const deletePostHandler = deletePostController(deletePostFlow);


  
  router.post("/", authMiddleware, rateLimitMiddleware, expressCallback(postPostHandler));

  router.get("/:id", authMiddleware, rateLimitMiddleware, expressCallback(getPostHandler));

  router.get("/", authMiddleware, rateLimitMiddleware, expressCallback(getPostsHandler));

  router.patch("/:id", authMiddleware, rateLimitMiddleware, expressCallback(updatePostHandler));

  router.get("/delete/:id", authMiddleware, rateLimitMiddleware, expressCallback(deletePostHandler));

  return router;
};

export default makePostRoutes;
