import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// export const authenticate = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Token missing" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // userId, role
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    //console.log("Received token:", token); // Debug log

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded JWT:", decoded); // Debug log

    // Ensure decoded token has userId and role
    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Map userId to id for consistency
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};

export const requireUser = async (req, res, next) => {
  if (!req.user || req.user.role !== "USER") {
    return res.status(403).json({ message: "User access required" });
  }
  next();
};