import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authController from "./controller";
import { validateSignIn, validateSignUp } from "./validations";

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user by providing name, email, and password.
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
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: User already exists
 *       500:
 *         description: Unexpected error during registration
 */
router.post(
  "/signup",
  validateSignUp,
  asyncHandler(authController.registerUser)
);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User login
 *     description: Sign in a user with email and password to obtain an access token and refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully signed in, returning access token and refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Unexpected error during sign in
 */
router.post("/signin", validateSignIn, asyncHandler(authController.loginUser));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     description: Use the refresh token to get a new access token.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully refreshed tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       401:
 *         description: Refresh token not found or invalid
 *       500:
 *         description: Unexpected error during token refresh
 */
router.post("/refresh", asyncHandler(authController.refreshAccessToken));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: Logs out the user by clearing the refresh token cookie.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Refresh token not found or invalid
 *       500:
 *         description: Unexpected error during logout
 */
router.post("/logout", asyncHandler(authController.logoutUser));

export default router;
