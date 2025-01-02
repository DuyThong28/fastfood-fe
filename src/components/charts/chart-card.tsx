import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="text-[#A93F15]">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
