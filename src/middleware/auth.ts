import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Invalid token format" });
      }
      const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;

      req.user = decoded; 

      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({ error: "Unauthorized!!!" });
      }

      next();
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;




