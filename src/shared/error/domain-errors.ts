export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already exists");
    this.name = "EmailAlreadyExistsError";
  }
}

export class ResourceNotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "ResourceNotFoundError";
  }
}
