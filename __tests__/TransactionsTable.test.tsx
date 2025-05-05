import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks das dependências externas
vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({
  authConfig: {},
}));
vi.mock("@/app/actions/get-transactions", () => ({
  getTransactions: vi.fn(),
}));
vi.mock("@/lib/utils", () => ({
  sleep: () => Promise.resolve(),
}));

vi.mock("../src/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../src/components/ui/table", () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableCell: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <td {...props}>{children}</td>,
  TableHead: ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableRow: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <tr {...props}>{children}</tr>,
}));
vi.mock("../src/components/UndoTransactionButton", () => ({
  UndoTransactionButton: () => <button>Desfazer</button>,
}));

import { TransactionsTable } from "../src/components/TransactionsTable";

describe("TransactionsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("não renderiza nada se não houver sessão", async () => {
    const { getServerSession } = await import("next-auth");
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      null
    );
    const result = await TransactionsTable();
    expect(result).toBeNull();
  });

  it("renderiza mensagem de vazio se não houver transações", async () => {
    const { getServerSession } = await import("next-auth");
    const { getTransactions } = await import("@/app/actions/get-transactions");
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      { user: { id: "1" } }
    );
    (getTransactions as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      transactions: [],
    });
    render(await TransactionsTable());
    expect(screen.getByText(/nenhuma transação encontrada/i)).toBeTruthy();
  });

  it("renderiza transações corretamente", async () => {
    const { getServerSession } = await import("next-auth");
    const { getTransactions } = await import("@/app/actions/get-transactions");
    (getServerSession as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      { user: { id: "1" } }
    );
    (getTransactions as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      transactions: [
        {
          id: "t1",
          senderId: "1",
          receiver: { name: "Maria", lastName: "Silva" },
          sender: { name: "João", lastName: "Souza" },
          amount: 100,
          createdAt: new Date("2023-01-01T12:00:00Z").toISOString(),
          status: "completed",
        },
        {
          id: "t2",
          senderId: "2",
          receiver: { name: "João", lastName: "Souza" },
          sender: { name: "Maria", lastName: "Silva" },
          amount: 50,
          createdAt: new Date("2023-01-02T15:00:00Z").toISOString(),
          status: "undone",
        },
      ],
    });
    render(await TransactionsTable());
    expect(screen.getByText(/histórico de transações/i)).toBeTruthy();
    expect(screen.getByText("Enviada")).toBeTruthy();
    expect(screen.getByText("Recebida")).toBeTruthy();
    expect(screen.getByText("Concluída")).toBeTruthy();
    expect(screen.getByText("Desfeita")).toBeTruthy();
    expect(screen.getByText("Desfazer")).toBeTruthy();
    expect(
      screen.getByText("R$ 100,00") || screen.getByText("R$ 100,00")
    ).toBeTruthy();
    expect(
      screen.getByText("R$ 50,00") || screen.getByText("R$ 50,00")
    ).toBeTruthy();
  });
});
