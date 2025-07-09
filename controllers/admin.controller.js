import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import transporter from "../utils/email.js";

// Get all tasks
export const getAllTasks = async (req, res) => {
  const tasks = await prisma.task.findMany({
    include: { assignedUser: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(tasks);
};

// Get users with PENDING status
export const getPendingUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    where: { status: "PENDING" },
  });
  res.json(users);
};

// Get users with Approved status
export const getApprovedUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    where: { status: "APPROVED" , role: "USER" },
  });
  res.json(users);
};

// Approve user
export const approveUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    await prisma.user.update({
      where: { id: id },
      data: { status: "APPROVED" },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Account Approval Notification",
      text: `Dear ${user.name},\n\nYour account has been approved. You can now log in using your credentials.\n\nBest regards,\nTask Management Team`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "User approved and notification sent" });
  } catch (err) {
    console.error("Error in approveUser:", err);
    res.status(500).json({ error: "Failed to approve user or send email" });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.update({
    where: { id },
    data: { status: "REJECTED" },
  });
  res.json({ message: "User rejected" });
};

export const createTask = async (req, res) => {
  const { title, description, dueDate, assignedUserId } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      assignedUserId,
    },
  });

  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status, assignedUserId } = req.body;

  const updated = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      dueDate: new Date(dueDate),
      status,
      assignedUserId,
    },
  });

  res.json(updated);
};
