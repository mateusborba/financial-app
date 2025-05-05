import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { amount } = await request.json();
  const value = Number(amount);
  if (isNaN(value)) {
    return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { balance: { increment: value } },
  });

  return NextResponse.json({ success: true });
}
