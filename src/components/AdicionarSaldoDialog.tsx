"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { toast } from "sonner";
import { addBalance } from "@/app/actions/add-balance";
import { Loader2 } from "lucide-react";

const schema = z.object({
  amount: z.string().min(1, "Informe o valor"),
});

type AdicionarSaldoForm = z.infer<typeof schema>;

export const AdicionarSaldoDialog = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<AdicionarSaldoForm>({
    resolver: zodResolver(schema),
    defaultValues: { amount: "" },
  });

  const onSubmit = async (data: AdicionarSaldoForm) => {
    try {
      await addBalance(Number(data.amount.replace(",", ".")));
      form.reset();
      setOpen(false);
      router.refresh();
      toast.success("Saldo adicionado com sucesso!");
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
        form.setError("amount", { message: e.message });
      } else {
        toast.error("Erro desconhecido");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar saldo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar saldo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="Digite o valor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Adicionar
              {form.formState.isSubmitting && (
                <Loader2 className="size-4 ml-2 animate-spin" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
