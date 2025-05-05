"use server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function makeTransaction({
  receiverId,
  amount,
}: {
  receiverId: string;
  amount: number;
}) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }
  if (!receiverId || !amount || amount <= 0) {
    throw new Error("Dados inválidos");
  }

  const sender = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!sender || Number(sender.balance) < amount) {
    throw new Error("Saldo insuficiente");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { balance: { decrement: amount } },
    }),
    prisma.user.update({
      where: { id: receiverId },
      data: { balance: { increment: amount } },
    }),
    prisma.transaction.create({
      data: {
        senderId: session.user.id,
        receiverId,
        amount,
        status: "completed",
      },
    }),
  ]);

  return { success: true };
}
