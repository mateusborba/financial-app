import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export default async function Page() {
  const session = await getServerSession(authConfig);

  console.log({ session });

  if (session) {
    redirect("/dashboard");
  }

  redirect("/login");
}
