// src/useCases/getUser.ts
import { UseCaseError } from "../../shared/error/use-case-error.js";
import { Post } from "../../entities/post.js";
import { IPostRepository } from "../../gateways/post-repository.js";

export const getPost =
  ({ postRepository }: { postRepository: IPostRepository }) =>
  async (id: string): Promise<Partial<Post> | null> => {
    const post = await postRepository.getPost(id);
    if (!post) throw new UseCaseError("Post not found");

    return post.toJson();
  };
