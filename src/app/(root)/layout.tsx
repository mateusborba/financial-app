import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted w-screen">
      <Navbar />
      <main className="mx-auto h-full w-screen px-4 sm:px-6 lg:px-10">
        {children}
      </main>
    </div>
  );
}
