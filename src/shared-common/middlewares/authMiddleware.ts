// src/common/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  // Verify token logic here
  next();
};
