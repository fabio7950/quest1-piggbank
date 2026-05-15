import { getMetrics, getTransactions } from "@/lib/api";
import type { DateRange } from "@/types";
 import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { TransactionsTable } from "@/components/dashboard/TransactionsTable";

type DashboardPageProps = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const dateRange = (params.from && params.to)
    ? { from: new Date(params.from), to: new Date(params.to) }
    : { from: new Date("2024-01-01"), to: new Date("2024-01-31") };

  const [metrics, transactions] = await Promise.all([
     ]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <span className="text-lg font-semibold text-foreground">
            piggybank
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
            BH
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-8">
  <div className="mb-8 flex items-center justify-between">
    <h1 className="text-2xl font-bold text-foreground">
      Dashboard
    </h1>

    <DateRangeFilter currentRange={dateRange} />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <MetricsCard metrics={metrics} />
  </div>

  <div className="rounded-xl border border-border bg-card">
    <TransactionsTable transactions={transactions} />
  </div>
</main>
  );
}
