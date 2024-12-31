import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as userController from "./controller";
import {
  validateCreateUser,
  validatePartialUpdateUser,
  validateReplaceUser,
  validateUserId,
} from "./validations";

const router = Router();

router.get("/", asyncHandler(userController.getAllUsers));

router.get("/:id", validateUserId, asyncHandler(userController.getUser));

router.post("/", validateCreateUser, asyncHandler(userController.createUser));

router.put(
  "/:id",
  validateReplaceUser,
  asyncHandler(userController.replaceUser)
);

router.patch(
  "/:id",
  validatePartialUpdateUser,
  asyncHandler(userController.partialUpdateUser)
);

router.delete("/:id", validateUserId, asyncHandler(userController.deleteUser));

export default router;
