import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({
  authConfig: {},
}));
vi.mock("@/lib/db", () => ({
  prisma: {
    transaction: {
      findMany: vi.fn(),
    },
  },
}));

import { getTransactions } from "../src/app/actions/get-transactions";

describe("getTransactions (server action)", () => {
  let getServerSessionMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { getServerSession } = await import("next-auth");
    getServerSessionMock = getServerSession as ReturnType<typeof vi.fn>;
  });

  it("deve lançar erro se não autenticado", async () => {
    getServerSessionMock.mockResolvedValue(null);
    await expect(getTransactions()).rejects.toThrow("Não autenticado");
  });

  it("deve retornar transações se autenticado", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    const { prisma } = await import("@/lib/db");
    (
      prisma.transaction.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue([
      {
        id: "t1",
        senderId: "1",
        receiverId: "2",
        sender: { name: "João", lastName: "Silva" },
        receiver: { name: "Maria", lastName: "Souza" },
        amount: 100,
        createdAt: new Date().toISOString(),
        status: "completed",
      },
    ]);
    const result = await getTransactions();
    expect(prisma.transaction.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ senderId: "1" }, { receiverId: "1" }],
      },
      include: {
        sender: { select: { name: true, lastName: true } },
        receiver: { select: { name: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toEqual({
      transactions: [
        {
          id: "t1",
          senderId: "1",
          receiverId: "2",
          sender: { name: "João", lastName: "Silva" },
          receiver: { name: "Maria", lastName: "Souza" },
          amount: 100,
          createdAt: expect.any(String),
          status: "completed",
        },
      ],
    });
  });
});
