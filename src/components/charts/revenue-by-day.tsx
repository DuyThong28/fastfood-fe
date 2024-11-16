import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueByDayProps = {
  data: { date: string; revenue: number }[];
};

export function RevenueByDay({ data }: RevenueByDayProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="hsl(var(--muted))" />
        <XAxis dataKey="date" stroke="hsl(var(--primary))" />
        <YAxis stroke="hsl(var(--primary))" />
        <Tooltip />
        <Line dataKey="revenue" type="monotone" stroke="hsl(var(--primary))" />
      </LineChart>
    </ResponsiveContainer>
  );
}
