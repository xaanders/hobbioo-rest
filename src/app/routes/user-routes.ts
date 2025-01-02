// src/app/routes/userRoutes.ts
import { Router } from "express";
import { createUserController, getUserController, updateUserController } from "../../controllers/user-controller.js";
import { createUser } from "../../use-cases/create-user.js";
import { InMemoryUserRepository } from "../../app/db/temporary.js";
import { helpers } from "../../app/helpers/helpers.js";
import { getUser } from "../../use-cases/get-user.js";
import { updateUser } from "../../use-cases/update-user.js";

const userRepository = new InMemoryUserRepository();

const router = Router();

// Compose the create user flow
const createUserFlow = createUser({ userRepository, helpers });
const getUserFlow = getUser({ userRepository });
const createUserHandler = createUserController(createUserFlow);
const getUserHandler = getUserController(getUserFlow);
const updateUserFlow = updateUser({ userRepository });
const updateUserHandler = updateUserController(updateUserFlow);

router.post("/", createUserHandler);
router.get("/:id", getUserHandler);
router.patch("/:id", updateUserHandler);

export default router;

