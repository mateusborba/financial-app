import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
  });

  if (
    !transaction ||
    transaction.senderId !== session.user.id ||
    transaction.status !== "completed"
  ) {
    return NextResponse.json(
      { error: "Transação não encontrada ou não pode ser desfeita" },
      { status: 400 }
    );
  }

  // Reverte a transação de forma atômica
  await prisma.$transaction([
    prisma.user.update({
      where: { id: transaction.senderId },
      data: { balance: { increment: transaction.amount } },
    }),
    prisma.user.update({
      where: { id: transaction.receiverId },
      data: { balance: { decrement: transaction.amount } },
    }),
    prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "undone" },
    }),
  ]);

  return NextResponse.json({ success: true });
}
