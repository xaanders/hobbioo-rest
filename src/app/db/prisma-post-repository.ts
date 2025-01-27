import { PrismaClient } from "@prisma/client";
import { IPostRepository } from "../../gateways/post-repository.js";
import { Post, PostStatus, ProcessingStatus } from "../../entities/post.js";

const createPrismaPostRepository = (prisma: PrismaClient): IPostRepository => ({
  async createPost(post: Post): Promise<Post> {
    const json = post.toJson();
    const createdPost = await prisma.post.create({
      data: {
        processing_status: 0,
        is_active: true,
        post_id: json.post_id,
        title: json.title,
        description: json.description,
        user_id: json.user_id,
        image_id: json.image_id,
        status: json.status,
        created_at: json.created_at,
        updated_at: json.updated_at,
      },
    });

    return new Post({
      post_id: createdPost.post_id,
      title: createdPost.title,
      description: createdPost.description,
      user_id: createdPost.user_id,
      image_id: createdPost.image_id,
      status: createdPost.status as PostStatus,
      created_at: createdPost.created_at.toISOString(),
      updated_at: createdPost.updated_at.toISOString(),
    });
  },

  async updatePost(id: string, data: Post): Promise<Post> {
    const updatedPost = await prisma.post.update({
      where: { post_id: id, user_id: data.user_id },
      data: {
        title: data.title,
        description: data.description,
        image_id: data.image_id,
        updated_at: new Date(),
      },
    });

    return new Post({
      post_id: updatedPost.post_id,
      title: updatedPost.title,
      description: updatedPost.description,
      user_id: updatedPost.user_id,
      image_id: updatedPost.image_id,
      status: updatedPost.status as PostStatus,
      created_at: updatedPost.created_at.toISOString(),
      updated_at: updatedPost.updated_at.toISOString(),
    });
  },

  async deletePost(id: string, user_id: string): Promise<boolean> {
    await prisma.post.update({
      where: { post_id: id, user_id: user_id },
      data: {
        status: 0,
        updated_at: new Date(),
      },
    });

    return true;
  },

  async getPost(id: string): Promise<Post | null> { // for general users
    const post = await prisma.post.findUnique({
      where: { post_id: id, status: 1 },
    });

    if (!post) return null;

    return new Post({
      post_id: post.post_id,
      title: post.title,
      description: post.description,
      user_id: post.user_id,
      image_id: post.image_id,
      is_active: post.is_active as boolean,
      processing_status: post.processing_status as ProcessingStatus,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
      status: post.status as PostStatus,
    });
  },

  async getActivePosts(): Promise<Post[]> { // for general users
    const posts = await prisma.post.findMany({
      where: { status: 1, is_active: true },
    });

    return posts.map(
      (post) =>
        new Post({
          post_id: post.post_id,
          title: post.title,
          description: post.description,
          user_id: post.user_id,
          image_id: post.image_id,
          status: post.status as PostStatus,
          created_at: post.created_at.toISOString(),
          updated_at: post.updated_at.toISOString(),
        })
    );
  },

  async getUserPosts(user_id: string): Promise<Post[]> { // user only
    const posts = await prisma.post.findMany({
      where: { user_id: user_id, status: 1 },
    });

    return posts.map(
      (post) =>
        new Post({
          post_id: post.post_id,
          title: post.title,
          description: post.description,
          user_id: post.user_id,
          image_id: post.image_id,
          is_active: post.is_active as boolean,
          processing_status: post.processing_status as ProcessingStatus,
          created_at: post.created_at.toISOString(),
          updated_at: post.updated_at.toISOString(),
        })
    );
  },

  async getAllPosts(): Promise<Post[]> { // admin only
    const posts = await prisma.post.findMany({
      where: { status: 1 }, 
      orderBy: {
        created_at: "desc",
        processing_status: "desc",
      }
    });

    return posts.map((post) => new Post({
      post_id: post.post_id,
      title: post.title,
      description: post.description,
      user_id: post.user_id,
      image_id: post.image_id,
      status: post.status as PostStatus,
      is_active: post.is_active as boolean,
      processing_status: post.processing_status as ProcessingStatus,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
    }));
  },
});




export { createPrismaPostRepository };

