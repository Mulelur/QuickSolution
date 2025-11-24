import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FinanceSummary } from "@/types/finance.types";

interface CardInfo {
  title: string;
  value: string | number;
}

export function SectionCards({ summary }: { summary: FinanceSummary }) {
  const cards: CardInfo[] = [
    { title: "Total Payments Amount", value: summary.total_payments_amount },
    { title: "Total Payments Made", value: summary.total_payments_count },
    { title: "Number of Invoices", value: summary.invoices_count },
    { title: "Unpaid Invoices", value: summary.unpaid_invoices_count },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="relative">
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {card.value}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
