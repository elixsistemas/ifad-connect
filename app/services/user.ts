import { prisma } from "../lib/prisma";
import { hash, compare } from "bcryptjs";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}) {
  const passwordHash = await hash(params.password, 10);

  return prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      password: passwordHash,
      role: "MEMBER",
    },
  });
}

export async function verifyUserPassword(email: string, plainPassword: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await compare(plainPassword, user.password);
  if (!isValid) return null;

  return user;
}