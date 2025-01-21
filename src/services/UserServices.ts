import prisma from "../client";

export default interface User {
  id?: number;
  email: string;
  name: string;
  password: string;
  role: string;
}

export default class UserService {
  static async create(user: User) {
    return await prisma.user.create({ data: user });
  }
  static async findUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }
  static async findUserById(id: number) {
    return await prisma.user.findUnique({ where: { id } });
  }
}
