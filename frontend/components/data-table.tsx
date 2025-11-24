"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice, Payment } from "@/types/finance.types";

type DataType = "payments" | "invoices";

export default function DataTable({ payments }: { payments: Payment[] }) {
  const [dataType, setDataType] = React.useState<DataType>("payments");
  const [tableData, setTableData] = React.useState<Payment[] | Invoice[]>(
    payments
  );
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const pageSize = 10;

  const paymentColumns: ColumnDef<Payment>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "reference", header: "Reference" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "currency", header: "Currency" },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
  ];

  const invoiceColumns: ColumnDef<Invoice>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "number", header: "Number" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "amount_due", header: "Amount" },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
  ];

  const columns = React.useMemo(
    () => (dataType === "payments" ? paymentColumns : invoiceColumns),
    [dataType]
  );

  // Fetch page-specific data for the table
  const fetchPage = async (pageNumber: number) => {
    const q = new URLSearchParams({
      page: pageNumber.toString(),
      page_size: pageSize.toString(),
    }).toString();
    const url =
      dataType === "payments"
        ? `http://127.0.0.1:8000/api/payments?${q}`
        : `http://127.0.0.1:8000/api/invoices?${q}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    setTableData(data.items);
    setTotal(data.total);
  };

  React.useEffect(() => {
    // Reset to first page when data type changes
    setPage(1);
    fetchPage(1);
  }, [dataType]);

  React.useEffect(() => {
    fetchPage(page);
  }, [page]);

  const nextPage = () => {
    if (page < Math.ceil(total / pageSize)) setPage((p) => p + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  // Creating the table instance
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
  });

  return (
    <div>
      <div className="mb-4">
        <Select
          value={dataType}
          onValueChange={(v) => setDataType(v as DataType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="payments">Payments</SelectItem>
            <SelectItem value="invoices">Invoices</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button onClick={prevPage} disabled={page === 1}>
          Previous
        </Button>
        <span>
          Page {page} of {Math.ceil(total / pageSize)}
        </span>
        <Button
          onClick={nextPage}
          disabled={page >= Math.ceil(total / pageSize)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
