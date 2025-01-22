import { IHelpers } from "../../app/helpers/IHelpers.js";
import { Post } from "../../entities/post.js";
import { ValidationError } from "../../shared/error/validation-error.js";

describe("Post Entity", () => {
  const mockHelpers = {
    sanitize: (value: string) => value.trim().replace(/<br\/>/gi, ""),
    generateId: () => "123",
  };
  const mockPost = {
    post_id: "123",
    title: "Test Post",
    description: "This is a test post",
    user_id: "123",
    image_id: "123",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  describe("Constructor", () => {
    it("should create a post", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, post_id: id, status: 1 });
      const json = post.toJson();
      expect(post).toBeDefined();
      expect(json).toEqual({ ...mockPost, post_id: id });
      expect(post.post_id).toBe(id);
    });
    it("should handle null input", () => {
      const post = new Post(null);
      expect(post).not.toBeUndefined();
      expect(post?.post_id).toBe("");
      expect(post?.title).toBe("");
      expect(post?.description).toBe("");
      expect(post?.user_id).toBe("");
      expect(post?.image_id).toBe("");
    });
  });

  describe("Validation", () => {
    it("should throw on empty post_id", () => {
      const post = new Post(null);
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Post ID is required");
    });
    it("should throw on empty title", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, title: "", post_id: id, status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Title is required");
    });
    it("should throw on long title", () => {
      const post = new Post({ ...mockPost, title: "a".repeat(201), status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Title is too long");
    });
    it("should throw on empty description", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, description: "", post_id: id, status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Description is required");
    });
    it("should throw on long description", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, description: "a".repeat(2001), post_id: id, status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Description is too long");
    });
    it("should throw on empty user_id", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, user_id: "", post_id: id, status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("User ID is required");
    });
    it("should throw on empty image_id", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, image_id: "", post_id: id, status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Image ID is required");
    });
    it("should not throw on valid post", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, post_id: id, status: 1 });
      expect(() => post.validatePostFields()).not.toThrow();
    });
  });

  describe("Sanitization", () => {
    const mockPost = {
      post_id: "123",
      title: "Test Post    ",
      description: "This is a test post<br/>",
      user_id: "123",
      image_id: "123",
      status: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    it("should sanitize the post", () => {
      const post = new Post(mockPost);
      post.sanitize(mockHelpers as IHelpers);
      expect(post.title).toBe("Test Post");
      expect(post.description).toBe("This is a test post");
      expect(post.user_id).toBe("123");
      expect(post.image_id).toBe("123");
      expect(post.status).toBe(1);
      expect(post.created_at).toBe(mockPost.created_at);
      expect(post.updated_at).toBe(mockPost.updated_at);
    });

    it("should sanitize the post with empty values", () => {
      const post = new Post(null);
      post.sanitize(mockHelpers as IHelpers);
      expect(post.title).toBe("");
      expect(post.description).toBe("");
      expect(post.user_id).toBe("");
      expect(post.image_id).toBe("");
    });
  });
});
