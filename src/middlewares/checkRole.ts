import { Request, Response, NextFunction } from "express";
import roles from "../utils/roles";
import prisma from "../client";
const checkRole = (role: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user?.id as string) },
    });
    const userRole = user?.role as string; // Assuming role is added to req.user via JWT
    const permissions = roles[userRole].can;

    if (permissions.includes(action)) {
      next(); // User has permission, proceed
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  };
};

export default checkRole;
