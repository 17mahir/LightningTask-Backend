import express from "express";
import {
  getAllTasks,
  getPendingUsers,
  approveUser,
  rejectUser,
  createTask,
  updateTask,
  getApprovedUsers
} from "../controllers/admin.controller.js";
import { requireAdmin, authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authenticate, requireAdmin); // protect all admin routes

router.get("/tasks", getAllTasks);
router.get("/pending-users", getPendingUsers);
router.put("/approve-user/:id", approveUser);
router.put("/reject-user/:id", rejectUser);
router.post('/create-task', createTask);
router.put('/update-task/:id', updateTask);
router.get("/approved-users", getApprovedUsers);



export default router;
