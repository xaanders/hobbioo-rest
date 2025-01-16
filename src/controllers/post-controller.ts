// src/controllers/post-controller.ts
import { Post } from "../entities/post.js";
import { HttpRequest, HttpResponse } from "../express/callback.js";

type CreatePostFn = ({ title, description, user_id, image_id }: { title: string, description: string, user_id: string, image_id: string }) => Promise<Partial<Post>>;

export const createPostController =
    (createPost: CreatePostFn) =>
        async (httpRequest: HttpRequest): Promise<HttpResponse> => {
            const user = httpRequest.body.user;

            const { title, description } = httpRequest.body;
            //TODO: check user_type === 2 
            //TODO: upload image and get image_id
            const image_id = "123";

            const post = await createPost({
                title: title as string,
                description: description as string,
                user_id: user['custom:user_id'] as string,
                image_id: image_id as string
            });

            return { statusCode: 200, body: post };
        };

type GetPostFn = (id: string) => Promise<Partial<Post> | null>;

export const getPostController =
    (getPost: GetPostFn) =>
        async (httpRequest: HttpRequest): Promise<HttpResponse> => {
            const { id } = httpRequest.params as { id: string };
            const post = await getPost(id);
            return { statusCode: 200, body: post };
        };

// type UpdatePostFn = (
//     id: string,
//     data: {
//         title: string;
//         description: string;
//     }
// ) => Promise<Partial<Post>>;

// export const updatePostController =
//     (updatePost: UpdatePostFn) =>
//         async (httpRequest: HttpRequest): Promise<HttpResponse> => {
//             const { id } = httpRequest.params as { id: string };
//             const { title, description } = httpRequest.body;

//             const post = await updatePost(id, {
//                 title: title as string,
//                 description: description as string,
//             });
//             return { statusCode: 200, body: post };
//         };

// type GetPostsFn = () => Promise<Partial<Post>[]>;

// export const getPostsController = (getPosts: GetPostsFn) => async (): Promise<HttpResponse> => {
//     const posts = await getPosts();
//     return { statusCode: 200, body: posts };
// };
