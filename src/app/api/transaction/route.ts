import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { receiverId, amount } = await request.json();
    const value = Number(amount);
    if (!receiverId || isNaN(value) || value <= 0) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: "Não é possível transferir para si mesmo" },
        { status: 400 }
      );
    }

    const sender = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!sender) {
      return NextResponse.json(
        { error: "Usuário remetente não encontrado" },
        { status: 404 }
      );
    }
    if (Number(sender.balance) < value) {
      return NextResponse.json(
        { error: "Saldo insuficiente" },
        { status: 400 }
      );
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      return NextResponse.json(
        { error: "Usuário destinatário não encontrado" },
        { status: 404 }
      );
    }

    // Transação atômica
    await prisma.$transaction([
      prisma.user.update({
        where: { id: sender.id },
        data: { balance: { decrement: value } },
      }),
      prisma.user.update({
        where: { id: receiver.id },
        data: { balance: { increment: value } },
      }),
      prisma.transaction.create({
        data: {
          amount: value,
          status: "completed",
          senderId: sender.id,
          receiverId: receiver.id,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar transação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
