// src/app/routes/userRoutes.ts
import { Router } from "express";
import { createUserController, getUserController, updateUserController } from "../../controllers/user-controller.js";
import { createUser } from "../../use-cases/create-user.js";
import { InMemoryUserRepository } from "../../app/db/temporary.js";
import { helpers } from "../../app/helpers/helpers.js";
import { getUser } from "../../use-cases/get-user.js";
import { updateUser } from "../../use-cases/update-user.js";
import { makeExpressCallback } from "../../express-callback/index.js";

const userRepository = new InMemoryUserRepository();

const router = Router();

// Compose the create user flow
const createUserFlow = createUser({ userRepository, helpers });
const createUserHandler = createUserController(createUserFlow);

const getUserFlow = getUser({ userRepository });
const getUserHandler = getUserController(getUserFlow);

const updateUserFlow = updateUser({ userRepository, helpers });
const updateUserHandler = updateUserController(updateUserFlow);

router.post("/", makeExpressCallback(createUserHandler));
router.get("/:id", makeExpressCallback(getUserHandler));
router.patch("/:id", makeExpressCallback(updateUserHandler));

export default router;

