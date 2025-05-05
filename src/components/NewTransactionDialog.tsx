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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { makeTransaction } from "@/app/actions/transaction";

const schema = z.object({
  receiverId: z.string().min(1, "Selecione um usuário"),
  amount: z.string().min(1, "Informe o valor"),
});

type NovaTransacaoForm = z.infer<typeof schema>;

type User = { id: string; name: string; lastName: string; email: string };

export const NewTransactionDialog = ({ users }: { users: User[] }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<NovaTransacaoForm>({
    resolver: zodResolver(schema),
    defaultValues: { receiverId: "", amount: "" },
  });

  const onSubmit = async (data: NovaTransacaoForm) => {
    try {
      await makeTransaction({
        receiverId: data.receiverId,
        amount: Number(data.amount.replace(",", ".")),
      });
      form.reset();
      setOpen(false);
      router.refresh();
      toast.success("Transação realizada com sucesso!");
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
        <Button>Nova transação</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="receiverId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Para</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className={cn(
                          "w-full",
                          form.formState.errors.receiverId && "border-red-500"
                        )}
                      >
                        <SelectValue placeholder="Selecione o usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      min="0.01"
                      placeholder="Digite o valor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Enviar
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
