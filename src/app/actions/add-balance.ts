"use server";

import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function addBalance(amount: number) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Valor inválido");
  }
  await prisma.user.update({
    where: { id: session.user.id },
    data: { balance: { increment: amount } },
  });
  return { success: true };
}
