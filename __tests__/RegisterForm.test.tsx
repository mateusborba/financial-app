import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RegisterForm } from "../src/components/RegisterForm";

const routerMocks = {
  push: vi.fn(),
};
vi.mock("next/navigation", () => ({
  useRouter: () => routerMocks,
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renderiza campos de nome, sobrenome, email e senha", () => {
    render(<RegisterForm />);
    expect(screen.getByRole("textbox", { name: "Nome" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Sobrenome" })).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Email" })).toBeTruthy();
    expect(screen.getByLabelText(/senha/i)).toBeTruthy();
  });

  it("valida campos obrigatórios e formato de email", async () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(await screen.findAllByText(/nome é obrigatório/i)).toBeTruthy();
    expect(await screen.findAllByText(/sobrenome é obrigatório/i)).toBeTruthy();
    expect(await screen.findAllByText(/email inválido/i)).toBeTruthy();
    expect(
      await screen.findAllByText(/senha deve ter pelo menos 8 caracteres/i)
    ).toBeTruthy();
  });

  it("mostra erro se a API retornar erro", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Email já cadastrado" }),
      })
    );
    render(<RegisterForm />);
    fireEvent.change(screen.getByRole("textbox", { name: "Nome" }), {
      target: { value: "João" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Sobrenome" }), {
      target: { value: "Silva" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "joao@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    expect(await screen.findByText(/email já cadastrado/i)).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it("redireciona para login se cadastro for bem-sucedido", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
    );
    render(<RegisterForm />);
    fireEvent.change(screen.getByRole("textbox", { name: "Nome" }), {
      target: { value: "João" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Sobrenome" }), {
      target: { value: "Silva" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Email" }), {
      target: { value: "joao@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: "12345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));
    await waitFor(() => {
      expect(routerMocks.push).toHaveBeenCalledWith("/login");
    });
    vi.unstubAllGlobals();
  });
});
