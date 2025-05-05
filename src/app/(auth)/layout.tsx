import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authConfig);
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <main className="h-screen w-full items-center justify-center flex">
      <div className="bg-foreground w-full h-full hidden lg:flex flex-col justify-between items-center py-10 border-r border-sidebar-foreground">
        <div />
        <div className="flex flex-col gap-2 items-center -mt-10">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-5xl text-background font-bold">
              Financial App
            </h1>
          </div>
        </div>
        <span className="text-primary-foreground mb-10">
          Gerencie suas finanças com facilidade.
        </span>
      </div>
      <div className="w-full flex justify-center gap-20 h-full flex-col px-10 lg:p-0 items-center">
        <div className="lg:hidden md:-mt-20 flex flex-col gap-2 justify-center items-center">
          <h1 className="text-3xl text-foreground font-bold">Financial App</h1>
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
