import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as userController from "./userController";
import {
  validateCreateUser,
  validatePartialUpdateUser,
  validateReplaceUser,
  validateUserId,
} from "./validations";

const router = Router();

router.get("/api/users", asyncHandler(userController.getAllUsers));

router.get(
  "/api/users/:id",
  validateUserId,
  asyncHandler(userController.getUser)
);

router.post(
  "/api/users",
  validateCreateUser,
  asyncHandler(userController.createUser)
);

router.put(
  "/api/users/:id",
  validateReplaceUser,
  asyncHandler(userController.replaceUser)
);

router.patch(
  "/api/users/:id",
  validatePartialUpdateUser,
  asyncHandler(userController.partialUpdateUser)
);

router.delete(
  "/api/users/:id",
  validateUserId,
  asyncHandler(userController.deleteUser)
);

export default router;
