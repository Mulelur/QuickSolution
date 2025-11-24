// src/store/types/finance.types.ts
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  items: T[];
}

// Example Payment
export interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

// Example Invoice
export interface Invoice {
  id: string;
  amount: number;
  paid: boolean;
  created_at: string;
}

// Summary response
export interface FinanceSummary {
  total_payments_count: number;
  unpaid_invoices_count: number;
  invoices_count: number;
  total_payments_amount: number;
}
