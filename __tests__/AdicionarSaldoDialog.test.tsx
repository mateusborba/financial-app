import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdicionarSaldoDialog } from "../src/components/AdicionarSaldoDialog";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/app/actions/add-balance", () => ({
  addBalance: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe("AdicionarSaldoDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza botão de adicionar saldo", () => {
    render(<AdicionarSaldoDialog />);
    expect(screen.getByText(/adicionar saldo/i)).toBeTruthy();
  });

  it("abre o dialog ao clicar no botão", () => {
    render(<AdicionarSaldoDialog />);
    fireEvent.click(
      screen.getAllByRole("button", { name: /Adicionar saldo/i })[0]
    );
    expect(screen.getByText(/valor/i)).toBeTruthy();
  });

  it("valida campos obrigatórios", async () => {
    render(<AdicionarSaldoDialog />);
    fireEvent.click(
      screen.getAllByRole("button", { name: /Adicionar saldo/i })[0]
    );
    fireEvent.click(screen.getAllByRole("button", { name: /Adicionar/i })[0]);
    expect(
      await screen.findAllByText(/Informe o valor|Selecione um usuário/)
    ).toBeTruthy();
  });

  it("adiciona saldo com sucesso", async () => {
    render(<AdicionarSaldoDialog />);

    fireEvent.click(
      screen.getAllByRole("button", { name: /Adicionar saldo/i })[0]
    );

    const dialog = screen.getByRole("dialog");

    const valorInput = within(dialog).getByLabelText(/valor/i);
    fireEvent.change(valorInput, { target: { value: "100" } });

    fireEvent.click(within(dialog).getByRole("button", { name: /Adicionar/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Saldo adicionado com sucesso!"
      );
    });
  });
});
