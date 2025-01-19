export const mockUserRepository = {
  createUser: jest.fn(),
  getUser: jest.fn(),
  getUsers: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

export const mockHelpers = {
  sanitize: jest.fn((input: string) => input.trim()),
  generateId: jest.fn(() => "mock-user-id"),
  logger: jest.fn(),
  isProductionData: jest.fn(() => false),
  getSettings: jest.fn(),
};

export const mockCognitoAuth = {
  authenticateUser: jest.fn(),
  registerUser: jest.fn(),
  confirmEmail: jest.fn(),
  logoutUser: jest.fn(),
  verifyToken: jest.fn(),
};

export const mockSessionManager = {
  createSession: jest.fn(),
  getSession: jest.fn(),
  removeSession: jest.fn(),
};
