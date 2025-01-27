import { createPost } from "../../use-cases/post/create-post.js";
import { getPost } from "../../use-cases/post/get-post.js";
import { updatePost } from "../../use-cases/post/update-post.js";
import { getAllPosts } from "../../use-cases/post/get-all-posts.js";
import { Post, PostProps } from "../../entities/post.js";
import { UseCaseError } from "../../shared/error/use-case-error.js";
import { IHelpers } from "../../app/helpers/IHelpers.js";

describe("Post Use Cases", () => {
  const mockPost = {
    post_id: "test-id",
    title: "Test Post",
    description: "Test Description",
    user_id: "user-123",
    image_id: "image-123",
    status: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  const mockHelpers: IHelpers = {
    sanitize: jest.fn((input: string) => input.trim()),
    generateId: jest.fn(() => "test-id"),
    logger: jest.fn(),
    isProductionData: jest.fn(() => false),
    getSettings: jest.fn(() => ({
      rateLimit: {
        maxRequests: 1000,
        timeWindowSec: 60000,
        ipWhitelist: [],
      },
    })),
  };

  const mockPostRepository = {
    createPost: jest.fn(),
    getPost: jest.fn(),
    updatePost: jest.fn(),
    deletePost: jest.fn(),
    getActivePosts: jest.fn(),
    getUserPosts: jest.fn(),
    getAllPosts: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a post successfully", async () => {
      mockPostRepository.createPost.mockResolvedValue(new Post(mockPost as PostProps));

      const createPostUseCase = createPost({
        postRepository: mockPostRepository,
        helpers: mockHelpers,
      });

      const result = await createPostUseCase({
        title: mockPost.title,
        description: mockPost.description,
        user_id: mockPost.user_id,
        image_id: mockPost.image_id,
      });

      expect(result).toEqual(mockPost);
      expect(mockPostRepository.createPost).toHaveBeenCalled();
      expect(mockHelpers.sanitize).toHaveBeenCalled();
      expect(mockHelpers.generateId).toHaveBeenCalled();
    });

    it("should throw error when post creation fails", async () => {
      mockPostRepository.createPost.mockResolvedValue(null);

      const createPostUseCase = createPost({
        postRepository: mockPostRepository,
        helpers: mockHelpers,
      });

      await expect(
        createPostUseCase({
          title: mockPost.title,
          description: mockPost.description,
          user_id: mockPost.user_id,
          image_id: mockPost.image_id,
        })
      ).rejects.toThrow(UseCaseError);
    });
  });

  describe("getPost", () => {
    it("should get a post by id", async () => {
      mockPostRepository.getPost.mockResolvedValue(new Post(mockPost as PostProps));

      const getPostUseCase = getPost({ postRepository: mockPostRepository });
      const result = await getPostUseCase("test-id");

      expect(result).toEqual(mockPost);
      expect(mockPostRepository.getPost).toHaveBeenCalledWith("test-id");
    });

    it("should throw error when post is not found", async () => {
      mockPostRepository.getPost.mockResolvedValue(null);

      const getPostUseCase = getPost({ postRepository: mockPostRepository });
      await expect(getPostUseCase("test-id")).rejects.toThrow(UseCaseError);
    });
  });

  describe("updatePost", () => {
    it("should update a post successfully", async () => {
      const updatedPost = { ...mockPost, title: "Updated Title" };
      mockPostRepository.updatePost.mockResolvedValue(new Post(updatedPost as PostProps));

      const updatePostUseCase = updatePost({
        postRepository: mockPostRepository,
        helpers: mockHelpers,
      });

      const result = await updatePostUseCase("test-id", {
        title: "Updated Title",
      });

      expect(result).toEqual(updatedPost);
      expect(mockPostRepository.updatePost).toHaveBeenCalled();
    });

    it("should throw error when post update fails", async () => {
      mockPostRepository.updatePost.mockResolvedValue(null);

      const updatePostUseCase = updatePost({
        postRepository: mockPostRepository,
        helpers: mockHelpers,
      });

      await expect(
        updatePostUseCase("test-id", { title: "Updated Title" })
      ).rejects.toThrow(UseCaseError);
    });
  });

  describe("getAllPosts", () => {
    it("should get all posts", async () => {
      const mockPosts = [new Post(mockPost as PostProps), new Post({ ...mockPost, post_id: "test-id-2" } as PostProps)];
      mockPostRepository.getAllPosts.mockResolvedValue(mockPosts);

      const getAllPostsUseCase = getAllPosts({ postRepository: mockPostRepository });
      const result = await getAllPostsUseCase();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockPost);
      expect(mockPostRepository.getAllPosts).toHaveBeenCalled();
    });

    it("should return empty array when no posts exist", async () => {
      mockPostRepository.getAllPosts.mockResolvedValue([]);

      const getAllPostsUseCase = getAllPosts({ postRepository: mockPostRepository });
      const result = await getAllPostsUseCase();

      expect(result).toHaveLength(0);
      expect(mockPostRepository.getAllPosts).toHaveBeenCalled();
    });
  });
});

