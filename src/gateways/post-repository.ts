import { Post } from "../entities/post.js";

export interface IPostRepository {
  createPost: (post: Post) => Promise<Post>;
  getPost: (id: string) => Promise<Post | null>;
  updatePost: (id: string, data: Post) => Promise<Post>;
  deletePost: (id: string, user_id: string) => Promise<boolean>;
  getActivePosts: () => Promise<Post[]>;
  getUserPosts: (user_id: string) => Promise<Post[]>;
  getAllPosts: () => Promise<Post[]>;
}