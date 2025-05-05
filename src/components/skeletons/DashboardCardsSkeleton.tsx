import { Skeleton } from "@/components/ui/skeleton";

export function DashboardCardsSkeleton() {
  return (
    <div className="w-full py-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="rounded-xl">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-6 shadow-sm">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
