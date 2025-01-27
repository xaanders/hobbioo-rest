import { IPostRepository } from "../../gateways/post-repository.js";
import { UseCaseError } from "../../shared/error/use-case-error.js";

export const deletePost = (postRepository: IPostRepository) => {
    return async (id: string, user_id: string): Promise<{message: string}> => {

        const deletedPost = await postRepository.deletePost(id, user_id);

        if (!deletedPost) throw new UseCaseError("Could not delete post");

        return { message: "Post successfully deleted" };
    };
};
