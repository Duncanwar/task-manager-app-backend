import prisma from "../../client";
import catchAsync from "../../utils/catchAsync";
import Responses from "../../utils/response";

export default class UserController {
  static getUsers = catchAsync(async (req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true },
    });
    return Responses.success(res, 200, "get all users", users);
  });
}
