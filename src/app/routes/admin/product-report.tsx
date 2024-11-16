import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePagination } from "@/components/shared/table-pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Meta } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { RevenueByDay } from "@/components/charts/revenue-by-day";
import { ChartCard } from "@/components/charts/chart-card";

export default function ProductReportRoute() {
  const [tabState, setTabState] = useState<string>("income");
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <h1 className="text-lg font-semibold">Báo cáo</h1>
        <Tabs value={tabState}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="income" onClick={() => setTabState("income")}>
                Doanh thu
              </TabsTrigger>
              <TabsTrigger
                value="product"
                onClick={() => setTabState("product")}
              >
                Sản phẩm
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        <div className="flex flex-row w-full gap-x-10">
          {tabState === "income" && (
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
                      {/* Replace with actual data mapping */}
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>5/11/2024</TableCell>
                        <TableCell>100</TableCell>
                        <TableCell>100</TableCell>
                      </TableRow>
                      {/* Add more rows as needed */}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">
                      Tổng doanh thu: 1.200.000
                    </h2>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50">
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
          )}
        </div>
      </main>
    </DashBoardLayout>
  );
}
