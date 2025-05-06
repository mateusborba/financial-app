import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoginForm } from "../src/components/LoginForm";

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

const routerMocks = {
  push: vi.fn(),
};
vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renderiza campos de email e senha", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/senha/i)).toBeTruthy();
  });

  it("valida campos obrigatórios e formato de email", async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findByText(/email é obrigatório/i)).toBeTruthy();
    expect(await screen.findByText(/senha é obrigatória/i)).toBeTruthy();

    // Testa formato de email inválido
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "foo" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findByText(/email invalido/i)).toBeTruthy();
  });

  it("mostra erro se signIn retornar erro", async () => {
    const { signIn } = await import("next-auth/react");
    (signIn as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      error: "Credenciais inválidas",
    });
    render(<LoginForm />);
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "user@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    const errors = await screen.findAllByText(/credenciais inválidas/i);
    expect(errors).toHaveLength(2);
  });

  it("redireciona para dashboard se login for bem-sucedido", async () => {
    const { signIn } = await import("next-auth/react");
    (signIn as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      error: undefined,
    });
    render(<LoginForm />);
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "user@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(routerMocks.push).toHaveBeenCalledWith("/dashboard");
    });
  });
});
