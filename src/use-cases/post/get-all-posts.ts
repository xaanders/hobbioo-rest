// src/useCases/getUser.ts
import { Post } from "../../entities/post.js";
import { IPostRepository } from "../../gateways/post-repository.js";

export const getAllPosts =
  ({ postRepository }: { postRepository: IPostRepository }) =>
  async (): Promise<Partial<Post>[]> => {
    const posts = await postRepository.getAllPosts();

    return posts.map((post) => post.toJson());
  };
