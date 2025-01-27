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
      const post = new Post({ ...mockPost, post_id: id, status: 1});
      const json = post.toJson();
      expect(post).toBeDefined();
      expect(json).toEqual({ ...mockPost, post_id: id, status: 1 });
      expect(post.post_id).toBe(id);
    });
    it("should handle null input", () => {
      const post = new Post(null);
      expect(post).not.toBeUndefined();
      expect(post?.post_id).toBe("");
      expect(post?.title).toBeUndefined();
      expect(post?.description).toBeUndefined();
      expect(post?.user_id).toBe("");
      expect(post?.image_id).toBeUndefined();
    });
  });

  describe("Validation", () => {
    it("should throw on empty post_id", () => {
      const post = new Post(null);
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Post ID is required");
    });
    // it("should throw on empty user_id", () => {
    //   const id = mockHelpers.generateId();
    //   const post = new Post({ ...mockPost, user_id: "", post_id: id, status: 1 });
    //   expect(() => post.validatePostFields()).toThrow(ValidationError);
    //   expect(() => post.validatePostFields()).toThrow("User ID is required");
    // });
    it("should throw on empty title", () => {
      const id = mockHelpers.generateId();
      const post = new Post({ ...mockPost, title: "", post_id: id, status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow("Title is required");
    });
    it("should throw on long title", () => {
      const post = new Post({ ...mockPost, title: "a".repeat(201), status: 1 });
      expect(() => post.validatePostFields()).toThrow(ValidationError);
      expect(() => post.validatePostFields()).toThrow(`Title cannot be longer than ${Post.MAX_TITLE_LENGTH} characters`);
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
      expect(() => post.validatePostFields()).toThrow(`Description cannot be longer than ${Post.MAX_DESCRIPTION_LENGTH} characters`);
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
      const post = new Post({...mockPost, status: 1});
      post.sanitizePostInputs(mockHelpers as IHelpers);
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
      post.sanitizePostInputs(mockHelpers as IHelpers);
      expect(post.title).toBeUndefined();
      expect(post.description).toBeUndefined();
      expect(post.user_id).toBe("");
      expect(post.image_id).toBeUndefined();
    });
  });

  describe("Update Validation", () => {
    it("should validate partial updates", () => {
      const post = new Post({ ...mockPost, description: "", title: "New Title" });
      const result = post.beforeUpdate(mockHelpers as IHelpers);

      expect(result).toEqual({ title: "New Title" });
    });
    it("should throw on empty update", () => {
      const post = new Post(null);
      expect(() => post.beforeUpdate(mockHelpers as IHelpers)).toThrow(ValidationError);
      expect(() => post.beforeUpdate(mockHelpers as IHelpers)).toThrow("No fields to update");
    });
    it("should remove undefined fields", () => {
      const post = new Post({ ...mockPost, description: undefined });
      const result = post.beforeUpdate(mockHelpers as IHelpers);

      expect(result).toHaveProperty("title");
      expect(result).not.toHaveProperty("description");
    });
    it("should throw on invalid title", () => {
      const post = new Post({ ...mockPost, title: "a".repeat(201) });
      expect(() => post.beforeUpdate(mockHelpers as IHelpers)).toThrow(ValidationError);
      expect(() => post.beforeUpdate(mockHelpers as IHelpers)).toThrow(`Title cannot be longer than ${Post.MAX_TITLE_LENGTH} characters`);
    });
    it("should throw on invalid description", () => {
      const post = new Post({ ...mockPost, description: "a".repeat(2001) });
      expect(() => post.beforeUpdate(mockHelpers as IHelpers)).toThrow(ValidationError);
      expect(() => post.beforeUpdate(mockHelpers as IHelpers)).toThrow(`Description cannot be longer than ${Post.MAX_DESCRIPTION_LENGTH} characters`);
    });
    it("should not throw on valid update", () => {
      const post = new Post({ ...mockPost, title: "New Title", description: "New Description" });
      expect(() => post.beforeUpdate(mockHelpers as IHelpers)).not.toThrow();
    });

    it("should sanitize the post", () => {
      const post = new Post({ ...mockPost, description: "   <br/>   ", title: "   <br/>   " });
      post.sanitizePostInputs(mockHelpers as IHelpers);
      expect(post.title).toBe("");
      expect(post.description).toBe("");
    });
  });
});
