import * as React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { NewTransactionDialog } from "../src/components/NewTransactionDialog";

const users = [
  { id: "1", name: "João", lastName: "Silva", email: "joao@email.com" },
  { id: "2", name: "Maria", lastName: "Souza", email: "maria@email.com" },
];

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("NewTransactionDialog", () => {
  beforeAll(() => {
    const portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "radix-portal");
    document.body.appendChild(portalRoot);
  });

  it("renderiza o botão de nova transação", () => {
    render(<NewTransactionDialog users={users} />);
    expect(
      screen.getAllByRole("button", { name: "Nova transação" })[0]
    ).toBeTruthy();
  });

  it("abre o dialog ao clicar no botão", () => {
    render(<NewTransactionDialog users={users} />);
    fireEvent.click(
      screen.getAllByRole("button", { name: "Nova transação" })[0]
    );
    expect(screen.getByLabelText("Valor")).toBeTruthy();
  });

  it("valida campos obrigatórios", async () => {
    render(<NewTransactionDialog users={users} />);
    fireEvent.click(
      screen.getAllByRole("button", { name: "Nova transação" })[0]
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Enviar" })[0]);
    expect(
      await screen.findAllByText(/Informe o valor|Selecione um usuário/)
    ).toHaveLength(2);
  });
});
