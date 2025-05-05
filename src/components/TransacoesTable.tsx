import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DesfazerTransacaoButton } from "./DesfazerTransacaoButton";

export default async function TransacoesTable() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return null;
  }
  const userId = session.user.id;

  const transacoes = await prisma.transaction.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, lastName: true, email: true } },
      receiver: {
        select: { id: true, name: true, lastName: true, email: true },
      },
    },
  });

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Histórico de Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transacoes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
            {transacoes.map((t) => {
              const isSent = t.senderId === userId;
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    {new Date(t.createdAt).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>{isSent ? "Enviada" : "Recebida"}</TableCell>
                  <TableCell>
                    {isSent
                      ? `${t.receiver.name} ${t.receiver.lastName}`
                      : `${t.sender.name} ${t.sender.lastName}`}
                  </TableCell>
                  <TableCell>
                    {Number(t.amount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>
                    {t.status === "completed" ? (
                      <span className="text-green-600">Concluída</span>
                    ) : t.status === "undone" ? (
                      <span className="text-yellow-600">Desfeita</span>
                    ) : (
                      t.status
                    )}
                  </TableCell>
                  <TableCell>
                    {isSent && t.status === "completed" && (
                      <DesfazerTransacaoButton id={t.id} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
