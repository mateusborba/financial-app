"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: { [key: string]: string } = {
    default: "Ocorreu um erro durante a autenticação",
    CredentialsSignin:
      "Email ou senha inválidos. Por favor, verifique suas credenciais e tente novamente.",
    EmailSignin: "Erro ao enviar email de autenticação",
    OAuthSignin: "Erro ao autenticar com provedor externo",
    OAuthCallback: "Erro ao processar autenticação externa",
    OAuthCreateAccount: "Erro ao criar conta com provedor externo",
    EmailCreateAccount: "Erro ao criar conta com email",
    Callback: "Erro ao processar autenticação",
    OAuthAccountNotLinked: "Email já está em uso com outro método de login",
    SessionRequired: "Você precisa estar logado para acessar esta página",
    AccessDenied: "Acesso negado. Verifique suas credenciais.",
  };

  const errorMessage = error
    ? errorMessages[error] || errorMessages.default
    : errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Erro de Autenticação
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
        </div>
        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={null}>
      <AuthErrorContent />
    </Suspense>
  );
}
