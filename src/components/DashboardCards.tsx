import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NovaTransacaoDialog } from "./NovaTransacaoDialog";
import { AdicionarSaldoDialog } from "./AdicionarSaldoDialog";
import { cn } from "@/lib/utils";

export default async function DashboardCards() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true, name: true, lastName: true, id: true },
  });

  const users = await prisma.user.findMany({
    where: { id: { not: session.user.id } },
    select: { id: true, name: true, lastName: true, email: true },
  });

  return (
    <div className="w-full py-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel</h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {user?.name} {user?.lastName}
          </p>
        </div>
        <div className="flex gap-2">
          <NovaTransacaoDialog users={users} />
          <AdicionarSaldoDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold">Saldo</h2>
          <p
            className={cn(
              "text-2xl font-bold",
              user?.balance && Number(user.balance) > 0
                ? "text-green-600"
                : "text-red-600"
            )}
          >
            {user
              ? Number(user.balance).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              : "Erro ao buscar saldo"}
          </p>
        </div>
      </div>
    </div>
  );
}
