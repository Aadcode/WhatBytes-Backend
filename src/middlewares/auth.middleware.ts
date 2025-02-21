import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;

    req.user = verified

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return
  }
};
