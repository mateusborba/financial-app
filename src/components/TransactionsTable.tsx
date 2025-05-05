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
import { UndoTransactionButton } from "./UndoTransactionButton";
import { getTransactions } from "@/app/actions/get-transactions";
import { sleep } from "@/lib/utils";

export const TransactionsTable = async () => {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  const { transactions } = await getTransactions();
  await sleep(2000);

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
            {transactions.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="text-center pt-8">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
            {transactions.map((t) => {
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
                      <UndoTransactionButton id={t.id} />
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
};
