import { Router } from "express";
import tokenAuthentication from "../middlewares/tokenAuthentication";
import UserController from "../controllers/user/UserController";
import checkRole from "../middlewares/checkRole";
import { errorHandler } from "../middlewares/errorHandler";

const router = Router();

router.get(
  "/",
  [tokenAuthentication, checkRole("admin", "view")],
  UserController.getUsers
);
router.use(errorHandler);
export default router;
