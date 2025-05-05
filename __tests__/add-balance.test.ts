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
      update: vi.fn(),
    },
  },
}));

import { addBalance } from "../src/app/actions/add-balance";

describe("addBalance (server action)", () => {
  let getServerSessionMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { getServerSession } = await import("next-auth");
    getServerSessionMock = getServerSession as ReturnType<typeof vi.fn>;
  });

  it("deve lançar erro se o usuário não estiver autenticado", async () => {
    getServerSessionMock.mockResolvedValue(null);
    await expect(addBalance(100)).rejects.toThrow("Usuário não autenticado");
  });

  it("deve lançar erro se o valor for inválido", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    await expect(addBalance(0)).rejects.toThrow("Valor inválido");
    await expect(addBalance(NaN)).rejects.toThrow("Valor inválido");
  });

  it("deve atualizar o saldo do usuário se autenticado e valor válido", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    const { prisma } = await import("@/lib/db");
    (
      prisma.user.update as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});
    const result = await addBalance(200);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: { balance: { increment: 200 } },
    });
    expect(result).toEqual({ success: true });
  });
});
