// src/useCases/createUser.ts
import { Post } from "../../entities/post.js";
import { IHelpers } from "../../app/helpers/IHelpers.js";
import { UseCaseError } from "../../shared/error/use-case-error.js";
import { IPostRepository } from "../../gateways/post-repository.js";

type CreatePostDTO = {
    title: string;
    description: string;
    user_id: string;
    image_id: string;
};

export const createPost =
    ({
        postRepository,
        helpers
    }: {
        postRepository: IPostRepository;
        helpers: IHelpers;
    }) =>
        async (postData: CreatePostDTO) => {
            const post_id = helpers.generateId();
            const post = new Post(
                {
                    post_id,
                    title: postData.title,
                    description: postData.description,
                    user_id: postData.user_id,
                    image_id: postData.image_id,
                    status: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }
            );
            post.sanitizeAndValidate(helpers);

            const createdPost = await postRepository.createPost(post);

            if (!createdPost) throw new UseCaseError("Failed to create post");

            return createdPost.toJson();
        };
