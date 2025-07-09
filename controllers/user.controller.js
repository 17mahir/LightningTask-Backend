import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserTasks = async (req, res) => {
  try {
   
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const tasks = await prisma.task.findMany({
      where: { assignedUserId: req.user.id },
      include: { assignedUser: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    res.status(500).json({ message: "Error fetching user tasks", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const task = await prisma.task.findFirst({
      where: { id, assignedUserId: req.user.id },
    });

    if (!task) {
      return res.status(403).json({ message: "Task not found or not assigned to you" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: { assignedUser: true },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Error updating task status", error: error.message });
  }
};