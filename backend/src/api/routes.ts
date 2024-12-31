import { Router } from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./user/routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);

export default router;
