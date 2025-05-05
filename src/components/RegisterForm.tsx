"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  lastName: z.string().min(1, { message: "Sobrenome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterSchema) => {
    try {
      setApiError(null);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar conta");
      }

      router.push("/login");
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Erro ao criar conta"
      );
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="justify-center">
        <CardTitle className="text-2xl font-bold">Cadastre-se</CardTitle>
      </CardHeader>
      <CardContent>
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn("text-sm")}
                      placeholder="Digite seu nome"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobrenome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn("text-sm")}
                      placeholder="Digite seu sobrenome"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className={cn("text-sm")}
                      placeholder="Digite seu email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      className={cn("text-sm")}
                      placeholder="Crie uma senha forte"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Já possui uma conta?{" "}
                <Link href="/login" className="underline text-primary">
                  Ir para o login
                </Link>
              </p>
            </div>
            <Button
              type="submit"
              className="mt-2 cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              Criar conta
              {form.formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin ml-2" />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
