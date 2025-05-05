import { DashboardCards } from "@/components/DashboardCards";
import { DashboardCardsSkeleton } from "@/components/skeletons/DashboardCardsSkeleton";
import { TransactionsTableSkeleton } from "@/components/skeletons/TransactionsTableSkeleton";
import { TransactionsTable } from "@/components/TransactionsTable";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCards />
      </Suspense>
      <Suspense fallback={<TransactionsTableSkeleton />}>
        <TransactionsTable />
      </Suspense>
    </>
  );
}
