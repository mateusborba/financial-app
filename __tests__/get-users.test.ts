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
      findMany: vi.fn(),
    },
  },
}));

import { getUsers } from "../src/app/actions/get-users";

describe("getUsers (server action)", () => {
  let getServerSessionMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { getServerSession } = await import("next-auth");
    getServerSessionMock = getServerSession as ReturnType<typeof vi.fn>;
  });

  it("deve lançar erro se não autenticado", async () => {
    getServerSessionMock.mockResolvedValue(null);
    await expect(getUsers()).rejects.toThrow("Não autenticado");
  });

  it("deve retornar usuários se autenticado", async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    const { prisma } = await import("@/lib/db");
    (
      prisma.user.findMany as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue([
      { id: "2", name: "Maria", lastName: "Silva", email: "maria@email.com" },
    ]);
    const result = await getUsers();
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { id: { not: "1" } },
      select: { id: true, name: true, lastName: true, email: true },
    });
    expect(result).toEqual({
      users: [
        { id: "2", name: "Maria", lastName: "Silva", email: "maria@email.com" },
      ],
    });
  });
});
