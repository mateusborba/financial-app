"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { ToggleTheme } from "./ToggleTheme";

export const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [{ name: "Dashboard", href: "/dashboard" }];

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="mx-auto flex w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between md:justify-start w-full">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold">Financial App</span>
          </div>
          <div className="ml-10 flex items-baseline space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="md:hidden flex items-center">
              <Button
                variant="destructive"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
        <div className="items-center gap-2.5 hidden md:flex">
          <ToggleTheme />
          <p className="text-sm w-max text-muted-foreground">
            {session?.user?.name} {session?.user?.lastName}
          </p>
          <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );
};
