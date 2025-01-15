import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Response, Request, NextFunction } from "express";
import Responses from "../utils/response";

config();

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadWithId;
    }
  }
}

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string | number;
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const tokenAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    Responses.error(res, 401, "Authorization header is missing or invalid", {});
    return;
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) {
      Responses.error(res, 401, "Invalid or expired token", {});
      return;
    }

    // Cast the payload to the custom interface
    const decodedPayload = payload as JwtPayloadWithId;

    if (!decodedPayload.id) {
      Responses.error(res, 401, "Token payload missing 'id'", {});
      return;
    }

    req.user = decodedPayload; // Attach strongly typed payload to the request
    next();
  });
};

export default tokenAuthentication;
