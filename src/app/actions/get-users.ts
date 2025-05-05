import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getUsers() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }
  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    select: { id: true, name: true, lastName: true, email: true },
  });

  return { users };
}
