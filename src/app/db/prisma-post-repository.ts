import { PrismaClient } from "@prisma/client";
import { IPostRepository } from "../../gateways/post-repository.js";
import { Post } from "../../entities/post.js";

const createPrismaPostRepository = (prisma: PrismaClient): IPostRepository => ({
  async createPost(post: Post): Promise<Post> {
    const createdPost = await prisma.post.create({
      data: {
        post_id: post.post_id,
        title: post.title,
        description: post.description,
        user_id: post.user_id,
        image_id: post.image_id,
        status: post.status,
        created_at: post.created_at,
        updated_at: post.updated_at,
      },
    });

    return new Post({
      post_id: createdPost.post_id,
      title: createdPost.title,
      description: createdPost.description,
      user_id: createdPost.user_id,
      image_id: createdPost.image_id,
      status: createdPost.status,
      created_at: createdPost.created_at.toISOString(),
      updated_at: createdPost.updated_at.toISOString(),
    });
  },

  async getPost(id: string): Promise<Post | null> {
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
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
      status: post.status,
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
      status: updatedPost.status,
      created_at: updatedPost.created_at.toISOString(),
      updated_at: updatedPost.updated_at.toISOString(),
    });
  },

  async deletePost(id: string, user_id: string): Promise<void> {
    await prisma.post.update({
      where: { post_id: id, user_id: user_id },
      data: {
        status: 0,
        updated_at: new Date(),
      },
    });
  },

  async getPosts(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { status: 1 },
    });

    return posts.map(
      (post) =>
        new Post({
          post_id: post.post_id,
          title: post.title,
          description: post.description,
          user_id: post.user_id,
          image_id: post.image_id,
          status: post.status,
          created_at: post.created_at.toISOString(),
          updated_at: post.updated_at.toISOString(),
        })
    );
  },
});

export { createPrismaPostRepository };
