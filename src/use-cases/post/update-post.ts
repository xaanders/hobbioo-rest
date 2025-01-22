import { IHelpers } from "../../app/helpers/IHelpers.js";
import { Post } from "../../entities/post.js";
import { IPostRepository } from "../../gateways/post-repository.js";
import { UseCaseError } from "../../shared/error/use-case-error.js";

export const updatePost = ({
  postRepository,
  helpers,
}: {
  postRepository: IPostRepository;
  helpers: IHelpers;
}) => {
  return async (id: string, data: Partial<Post>): Promise<Partial<Post>> => {
    const post = new Post({
      post_id: id,
      title: data.title,
      description: data.description,
      user_id: data.user_id as string,
      image_id: data.image_id,
      status: data.status as 0 | 1 | undefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });

    const upd = post.beforeUpdate(helpers);

    const updatedPost = await postRepository.updatePost(id, upd as Post);

    if (!updatedPost) throw new UseCaseError("Could not update post");

    return updatedPost.toJson();
  };    
};
