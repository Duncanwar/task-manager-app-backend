import catchAsync from "../../utils/catchAsync";
import prisma from "../../client";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../../utils/helpers";
import Response from "../../utils/response";
import {
  changePasswordSchema,
  loginSchema,
  signupSchema,
} from "../../validations/User.validation";

interface User {
  id: string | number;
}

export default class AuthController {
  static signup = catchAsync(async (req, res) => {
    const { name, email, password, role } = req.body;

    const { error } = signupSchema.validate(req.body);

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return Response.error(res, 400, "Validation Error", {
        errors: validationErrors,
      });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return Response.error(res, 409, "User already exists", {});
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, password: hashedPassword, email, role: "admin" },
      select: { id: true, name: true, email: true, role: true }, // Exclude password at query level
    });

    return Response.success(res, 201, "User created", user);
  });

  static login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body);

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return Response.error(res, 400, "Incorrect credentials", {
        errors: validationErrors,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      // select: { id: true, name: true, email: true, password: true }, // Include password for comparison
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return Response.error(res, 422, "User Not Found", {});
    }

    const accessToken = generateToken({ id: user.id });
    // const safeUser = exclude(user, ["password"]);

    return Response.success(res, 200, "Logged in successfully", {
      accessToken,
      user,
    });
  });

  static changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const { error } = changePasswordSchema.validate(req.body);

    if (error) {
      const validationErrors = error.details.map((err) => err.message);
      return Response.error(res, 400, "Incorrect inputs", {
        errors: validationErrors,
      });
    }
    const hashNewPassword = await hashPassword(newPassword);
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id as number },
    });

    if (!(await comparePassword(currentPassword, user?.password as string))) {
      return Response.error(res, 400, "current password is incorrect");
    }

    if (await comparePassword(newPassword, user?.password as string)) {
      return Response.error(res, 400, "Current and new password are matching");
    }

    await prisma.user.update({
      where: { id: req.user?.id as number },
      data: { password: hashNewPassword },
    });

    return Response.success(res, 200, "Password changed successfully");
  });

  static deleteUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!req.user) return Response.error(res, 403, "Unauthorized request");
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!userExists) {
      return Response.error(res, 404, "Nonexistent user ID");
    }
    await prisma.user.delete({
      where: { id: userExists?.id },
    });
    return Response.success(res, 200, "user deleted successfully");
  });
}
