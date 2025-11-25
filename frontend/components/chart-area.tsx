"use client";

import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: Array<{
    created_at: string;
    amount?: number;
    total?: number;
  }>;
  valueKey: "amount" | "amount_due";
  color?: string;
}

const chartConfig = {
  main: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AnalyticsChart({
  title,
  description = "",
  data = [],
  valueKey,
  color = "var(--color-main)",
}: AnalyticsChartProps) {
  if (!data) {
    return <p>No data</p>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedData = data.map((item: any) => {
    const key = valueKey;

    return {
      date: item.created_at,
      value: item[key] ?? 0,
    };
  });

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="fillMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor={color} stopOpacity={0.6} />
                <stop offset="90%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillMain)"
              stroke={color}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
