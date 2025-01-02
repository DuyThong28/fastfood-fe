import {
  CartesianGrid,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ProductByDayProps = {
  data: { name: string; numberOfProducts: number }[];
};

export function ProductByDay({ data }: ProductByDayProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="hsl(var(--primary))" />
        <YAxis stroke="hsl(var(--primary))" />
        <Tooltip />
        <Bar
          dataKey="numberOfProducts"
          type="monotone"
          fill="#82ca9d"
          barSize={10}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
