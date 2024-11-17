import { useState } from "react";
import { TablePagination } from "@/components/shared/table-pagination";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Meta } from "@/types/api";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { RevenueByDay } from "@/components/charts/revenue-by-day";
import { ChartCard } from "@/components/charts/chart-card";

export default function RevenueTab() {
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  return (
    <>
      <Card className="flex-1" x-chunk="dashboard-06-chunk-0">
        <CardContent className="flex flex-col gap-6 mt-6">
          <div className="flex gap-x-5 items-center mb-4">
            <Input type="date" className="border rounded p-2 w-fit" />
            <Select defaultValue="week">
              <SelectTrigger className="border rounded p-2 w-20">
                <SelectValue placeholder="Tuần" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
                <SelectItem value="year">Năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Ngày</TableCell>
                <TableCell>Số đơn hàng</TableCell>
                <TableCell>Doanh thu</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>5/11/2024</TableCell>
                <TableCell>100</TableCell>
                <TableCell>100</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/50">
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Tổng doanh thu: 1.200.000</h2>
          </div>
          <TablePagination data={meta} onChange={setMeta} />
        </CardFooter>
      </Card>
      <ChartCard title="Doanh thu">
        <RevenueByDay
          data={[
            { date: "12-12-2024", revenue: 20 },
            { date: "13-12-2024", revenue: 100 },
            { date: "14-12-2024", revenue: 30 },
            { date: "15-12-2024", revenue: 50 },
          ]}
        />
      </ChartCard>
    </>
  );
}
