import { Router } from "express";
import tokenAuthentication from "../middlewares/tokenAuthentication";
import UserController from "../controllers/user/UserController";
import { errorHandler } from "../middlewares/errorHandler";

const router = Router();

router.get(
  "/",
  // tokenAuthentication,
  UserController.getUsers
);

// router.use(errorHandler);
export default router;
