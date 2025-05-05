"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [{ name: "Dashboard", href: "/dashboard" }];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex w-full items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 items-center">
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
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-sm text-gray-500">
              {session?.user?.name} {session?.user?.lastName}
            </div>
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full px-4 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
