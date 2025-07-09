import express from "express";
import { getUserTasks, updateTaskStatus } from "../controllers/user.controller.js";
import { authenticate, requireUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate, requireUser); // Protect all user routes

router.get("/tasks", getUserTasks);
router.put("/tasks-status/:id", updateTaskStatus);

export default router;