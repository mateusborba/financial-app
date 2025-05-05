import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({
  authConfig: {},
}));
vi.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { makeTransaction } from "../../src/app/actions/post-transaction";

describe("makeTransaction (server action)", () => {
  let getServerSessionMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { getServerSession } = await import("next-auth");
    getServerSessionMock = getServerSession as ReturnType<typeof vi.fn>;
  });

  it("deve lançar erro se não autenticado", async () => {
    getServerSessionMock.mockResolvedValue(null);
    await expect(
      makeTransaction({ receiverId: "2", amount: 100 })
    ).rejects.toThrow("Não autenticado");
  });

  it("deve lançar erro se dados inválidos", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    await expect(
      makeTransaction({ receiverId: "", amount: 100 })
    ).rejects.toThrow("Dados inválidos");
    await expect(
      makeTransaction({ receiverId: "2", amount: 0 })
    ).rejects.toThrow("Dados inválidos");
  });

  it("deve lançar erro se saldo insuficiente", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    const { prisma } = await import("@/lib/db");
    (
      prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ id: "1", balance: 50 });
    await expect(
      makeTransaction({ receiverId: "2", amount: 100 })
    ).rejects.toThrow("Saldo insuficiente");
  });

  it("deve realizar transação se dados válidos e saldo suficiente", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    const { prisma } = await import("@/lib/db");
    (
      prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({ id: "1", balance: 200 });
    (
      prisma.$transaction as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue([{}, {}, {}]);
    const result = await makeTransaction({ receiverId: "2", amount: 100 });
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({ success: true });
  });
});
