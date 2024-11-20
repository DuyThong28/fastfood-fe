import { useEffect, useState } from "react";
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
import { api } from "@/lib/api-client";
import { Statistic } from "@/types/statistics";

export default function RevenueTab() {
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  const extractDateParts = (date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return { day, month, year };
  };

  const getStatistics = async () => {
    if (!selectedDate) return;
    try {
      const response = await api.get("/statistics");
      setStatistics(response.data.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      getStatistics();
      console.log(statistics);
    }
  }, [selectedDate]);

  return (
    <>
      <Card className="flex-1" x-chunk="dashboard-06-chunk-0">
        <CardContent className="flex flex-col gap-6 mt-6">
          <div className="flex gap-x-5 items-center mb-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded p-2 w-fit"
            />
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
              {statistics.map((stat, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{stat.day}</TableCell>
                  <TableCell>{stat.total_order}</TableCell>
                  <TableCell>{stat.total_revenue}</TableCell>
                </TableRow>
              ))}
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
