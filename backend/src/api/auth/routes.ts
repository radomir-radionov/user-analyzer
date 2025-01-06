import { Router } from "express";
import passport from "passport";
import { asyncHandler } from "../../utils/asyncHandler";
import * as authController from "./controller";
import { generateTokens } from "./services/tokenService";
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
 * /api/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     description: Redirects to Google OAuth for login.
 *     responses:
 *       302:
 *         description: Redirects to Google login
 */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google after successful authentication.
 *     responses:
 *       200:
 *         description: Successfully authenticated via Google
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;

    if (user) {
      const tokens = generateTokens(user);

      res.json({
        message: "Authentication successful",
        tokens,
      });
      // res.redirect("/profile");
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  }
);

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
 *     security:
 *       - BearerAuth: []  # Authorization header required for token refresh
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
 *     security:
 *       - BearerAuth: []  # Authorization header required for logout
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
