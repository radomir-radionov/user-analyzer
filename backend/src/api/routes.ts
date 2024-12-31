import { Router } from "express";
import userRoutes from "./user/userRoutes";

const router = Router();

router.use(userRoutes);

export default router;
