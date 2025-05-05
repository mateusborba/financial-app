"use server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function getTransactions() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }
  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    },
    include: {
      sender: {
        select: {
          name: true,
          lastName: true,
        },
      },
      receiver: {
        select: {
          name: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { transactions };
}
