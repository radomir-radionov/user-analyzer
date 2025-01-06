import { Router } from "express";
import { authenticateUser } from "../../middleware/authMiddleware";
import { asyncHandler } from "../../utils/asyncHandler";
import * as userController from "./controller";
import {
  validateCreateUser,
  validatePartialUpdateUser,
  validateReplaceUser,
  validateUserId,
} from "./validations";

const router = Router();

router.use(authenticateUser); // Ensure all routes require authentication

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []  # Indicates that the Authorization header is required
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/", asyncHandler(userController.getAllUsers));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve
 *     security:
 *       - BearerAuth: []  # Authorization header required
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: User not found
 */
router.get("/:id", validateUserId, asyncHandler(userController.getUser));

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     security:
 *       - BearerAuth: []  # Authorization header required
 *     responses:
 *       201:
 *         description: The created user object
 *       400:
 *         description: Email already in use
 */
router.post("/", validateCreateUser, asyncHandler(userController.createUser));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Replace a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to replace
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     security:
 *       - BearerAuth: []  # Authorization header required
 *     responses:
 *       200:
 *         description: The updated user object
 */
router.put(
  "/:id",
  validateReplaceUser,
  asyncHandler(userController.replaceUser)
);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Partially update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string
 *     security:
 *       - BearerAuth: []  # Authorization header required
 *     responses:
 *       200:
 *         description: The updated user object
 *       404:
 *         description: User not found for update
 */
router.patch(
  "/:id",
  validatePartialUpdateUser,
  asyncHandler(userController.partialUpdateUser)
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     security:
 *       - BearerAuth: []  # Authorization header required
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       404:
 *         description: User not found for deletion
 */
router.delete("/:id", validateUserId, asyncHandler(userController.deleteUser));

export default router;
