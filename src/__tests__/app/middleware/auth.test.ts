import { Request, Response, NextFunction } from "express";
import makeAuthMiddleware from "../../../app/auth/middleware.js";

describe("Auth Middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let nextFunction: NextFunction;
  const sessionManager = {
    createSession: jest.fn(),
    getSession: jest.fn(),
    removeSession: jest.fn(),
  };

  beforeEach(() => {
    mockReq = {
      headers: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it("should pass valid token", async () => {
    // Arrange
    mockReq.headers = {
      authorization: "Bearer valid-token",
    };
    const expiresAt = Date.now() + 3600000;
    const mockSession = {
      session: {},
      user: {
        id: "123",
        email: "test@example.com",
      },
      expiresAt: expiresAt,
    };
    sessionManager.getSession.mockResolvedValue(mockSession);
    const authMiddleware = makeAuthMiddleware(sessionManager);

    // Act
    await authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    // Assert
    expect(sessionManager.getSession).toHaveBeenCalledWith("Bearer valid-token");
    expect(nextFunction).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(mockReq.body["user"]).toEqual(mockSession);
  });

  it("should reject when no session provided", async () => {
    // Arrange
    const authMiddleware = makeAuthMiddleware(sessionManager);

    // Act
    await authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    // Assert
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "No session provided",
      redirect: "/login",
    });
  });

  it("should reject invalid session", async () => {
    // Arrange
    mockReq.headers = {
      authorization: "Bearer invalid-token",
    };
    sessionManager.getSession.mockResolvedValue(null);
    const authMiddleware = makeAuthMiddleware(sessionManager);

    // Act
    await authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    // Assert
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid session",
      redirect: "/login",
    });
  });

  it("should handle unexpected errors", async () => {
    // Arrange
    mockReq.headers = {
      authorization: "Bearer valid-token",
    };
    sessionManager.getSession.mockRejectedValue(new Error("Unexpected error"));
    const authMiddleware = makeAuthMiddleware(sessionManager);

    // Act
    await authMiddleware(mockReq as Request, mockRes as Response, nextFunction);

    // Assert
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Authentication failed",
      redirect: "/login",
    });
  });
});
