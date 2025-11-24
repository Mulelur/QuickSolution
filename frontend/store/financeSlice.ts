/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/financeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  PaginatedResponse,
  Payment,
  Invoice,
  FinanceSummary,
} from "../types/finance.types";

interface FinanceState {
  payments: PaginatedResponse<Payment> | null;
  invoices: PaginatedResponse<Invoice> | null;
  summary: FinanceSummary | null;
  status: "idle" | "loading" | "error";
}

const initialState: FinanceState = {
  payments: null,
  invoices: null,
  summary: null,
  status: "idle",
};

async function apiGet(url: string) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const fetchPayments = createAsyncThunk(
  "finance/fetchPayments",
  async (params: { page: number; page_size: number; status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return await apiGet(`${process.env.NEXT_PUBLIC_API_URL}/api/payments?${q}`);
  }
);

export const fetchInvoices = createAsyncThunk(
  "finance/fetchInvoices",
  async (params: { page: number; page_size: number; status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return await apiGet(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices?${q}`);
  }
);

export const fetchFinanceSummary = createAsyncThunk(
  "finance/fetchSummary",
  async () => {
    return await apiGet(`${process.env.NEXT_PUBLIC_API_URL}/api/summary`);
  }
);

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Payments
      .addCase(fetchPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = "idle";
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state) => {
        state.status = "error";
      })

      // Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.status = "idle";
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state) => {
        state.status = "error";
      })

      // Summary
      .addCase(fetchFinanceSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFinanceSummary.fulfilled, (state, action) => {
        state.status = "idle";
        state.summary = action.payload;
      })
      .addCase(fetchFinanceSummary.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default financeSlice.reducer;
