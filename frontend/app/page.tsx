"use client";

import { useEffect } from "react";
import { AnalyticsChart } from "@/components/chart-area";
import DataTable from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchPayments,
  fetchFinanceSummary,
  fetchInvoices,
} from "@/store/financeSlice";

export default function NewsletterDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const payments = useSelector((s: RootState) => s.finance.payments);
  const invoices = useSelector((s: RootState) => s.finance.invoices);
  const summary = useSelector((s: RootState) => s.finance.summary);
  const status = useSelector((s: RootState) => s.finance.status);

  useEffect(() => {
    dispatch(fetchPayments({ page: 1, page_size: 20 }));
    dispatch(fetchInvoices({ page: 1, page_size: 20 }));
    dispatch(fetchFinanceSummary());
  }, [dispatch]);

  if (status === "loading")
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <>
      <div className="w-full flex flex-col justify-center px-8 sm:px-12 md:px-22 lg:px-30 py-4">
        <h1 className="py-8 text-2xl">Dashboard</h1>
        <div className="w-full max-w-7xl flex flex-col gap-8">
          {summary && <SectionCards summary={summary} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payments && (
              <AnalyticsChart
                title="Payments Over Time"
                description="Transactions grouped visually"
                data={payments.items}
                valueKey="amount"
                color="hsl(var(--chart-1))"
              />
            )}
            {invoices && (
              <AnalyticsChart
                title="Invoice Over Time"
                description="Transactions grouped visually"
                data={invoices.items}
                valueKey="amount_due"
                color="hsl(var(--chart-1))"
              />
            )}
          </div>

          {payments && invoices && (
            <div className="bg-white/5 rounded-2xl border border-white/10">
              <DataTable payments={payments?.items} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
