"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().min(1, "Email é obrigatório").email("Email invalido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        form.setError("email", { message: "Credenciais inválidas" });
        form.setError("password", { message: "Credenciais inválidas" });
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erro ao fazer login");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="justify-center">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu email" {...field} />
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
                      type="password"
                      placeholder="Digite sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <div className="text-sm text-red-500">{error}</div>}

            <p className="text-sm text-muted-foreground">
              Ainda nao tem conta?{" "}
              <Link href="/register" className="text-primary cursor pointer">
                Cadastre-se
              </Link>
            </p>

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full mt-2">
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
