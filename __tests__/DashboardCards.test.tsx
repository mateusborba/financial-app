import { render, screen } from "@testing-library/react";
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
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: () => {
    throw new Error("redirect");
  },
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/app/actions/get-users", () => ({
  getUsers: vi.fn(),
}));

vi.mock("@/lib/utils", () => ({
  cn: (...args: string[]) => args.join(" "),
  sleep: () => Promise.resolve(),
}));

vi.mock("../src/components/NewTransactionDialog", () => ({
  NewTransactionDialog: () => <div data-testid="nova-transacao-dialog" />,
}));
vi.mock("../src/components/AdicionarSaldoDialog", () => ({
  AdicionarSaldoDialog: () => <div data-testid="adicionar-saldo-dialog" />,
}));
vi.mock("../src/components/ui/card", () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

import { DashboardCards } from "../src/components/DashboardCards";

describe("DashboardCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza informações do usuário e saldo", async () => {
    const mockUser = {
      id: "1",
      name: "João",
      lastName: "Silva",
      balance: 150,
    };
    const mockUsers = { users: [{ id: "2", name: "Maria" }] };

    const { getServerSession } = await import("next-auth");
    const { prisma } = await import("@/lib/db");
    const { getUsers } = await import("@/app/actions/get-users");

    const getServerSessionMock = getServerSession as ReturnType<typeof vi.fn>;
    const getUsersMock = getUsers as ReturnType<typeof vi.fn>;
    const findUniqueMock = prisma.user.findUnique as ReturnType<typeof vi.fn>;

    getServerSessionMock.mockResolvedValue({ user: { id: "1" } });
    findUniqueMock.mockResolvedValue(mockUser);
    getUsersMock.mockResolvedValue(mockUsers);

    render(await DashboardCards());

    expect(screen.getByText(/Painel/i)).toBeTruthy();
    expect(screen.getByText(/Bem-vindo de volta, João Silva/i)).toBeTruthy();
    expect(screen.getByText("R$ 150,00")).toBeTruthy();
    expect(screen.getByTestId("nova-transacao-dialog")).toBeTruthy();
    expect(screen.getByTestId("adicionar-saldo-dialog")).toBeTruthy();
  });

  it("redireciona se não houver sessão", async () => {
    const { getServerSession } = await import("next-auth");
    const getServerSessionMock = getServerSession as ReturnType<typeof vi.fn>;
    getServerSessionMock.mockResolvedValue(null);
    await expect(DashboardCards()).rejects.toThrow("redirect");
  });
});
