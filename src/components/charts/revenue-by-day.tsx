import {
  Bar,
  CartesianGrid,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type RevenueByDayProps = {
  data: { date: string; revenue: number }[];
};

export function RevenueByDay({ data }: RevenueByDayProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="hsl(var(--primary))" />
        <YAxis stroke="hsl(var(--primary))" />
        <Tooltip />
        <Bar dataKey="revenue" type="monotone" fill="#82ca9d" barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
}
