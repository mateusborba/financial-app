"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const UndoTransactionButton = ({ id }: { id: string }) => {
  const router = useRouter();

  const handleUndoTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/transaction/undo/${id}`, { method: "POST" });
      router.refresh();
      toast.success("Transação desfeita com sucesso");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido");
      }
    }
  };

  return (
    <form onSubmit={handleUndoTransaction}>
      <Button type="submit" size="sm" variant="outline">
        Desfazer
      </Button>
    </form>
  );
};
