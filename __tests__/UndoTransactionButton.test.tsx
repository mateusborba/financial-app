import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UndoTransactionButton } from "../src/components/UndoTransactionButton";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const routerMocks = { refresh: vi.fn() };
vi.mock("next/navigation", () => ({ useRouter: () => routerMocks }));

describe("UndoTransactionButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renderiza o botão de desfazer", () => {
    render(<UndoTransactionButton id="t1" />);
    expect(screen.getByRole("button", { name: /desfazer/i })).toBeTruthy();
  });

  it("faz fetch e mostra toast de sucesso ao desfazer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({}));
    render(<UndoTransactionButton id="t1" />);
    fireEvent.click(screen.getByRole("button", { name: /desfazer/i }));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Transação desfeita com sucesso"
      );
      expect(routerMocks.refresh).toHaveBeenCalled();
    });
    vi.unstubAllGlobals();
  });

  it("mostra toast de erro se fetch falhar", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Erro ao desfazer"))
    );
    render(<UndoTransactionButton id="t1" />);
    fireEvent.click(screen.getByRole("button", { name: /desfazer/i }));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao desfazer");
    });
    vi.unstubAllGlobals();
  });
});
