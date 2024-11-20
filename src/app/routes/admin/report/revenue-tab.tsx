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
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { RevenueByDay } from "@/components/charts/revenue-by-day";
import { ChartCard } from "@/components/charts/chart-card";
import { api } from "@/lib/api-client";
import { Statistic } from "@/types/statistics";
import SelectTime from "@/components/shared/date-calendar";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { formatNumber } from "@/utils/format";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedView, setSelectedView] = useState("week");
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  const getCurrentDateRange = (date: Dayjs) => {
    if (selectedView === "week") {
      const startOfWeek = date
        .startOf("week")
        .add(date.startOf("week").day() === 0 ? 1 : 0, "day");
      const endOfWeek = startOfWeek.add(6, "days");
      return `${startOfWeek.format("DD/MM/YYYY")} - ${endOfWeek.format("DD/MM/YYYY")}`;
    } else if (selectedView === "month") {
      return date.format("MM/YYYY");
    } else if (selectedView === "year") {
      return date.format("YYYY");
    }
    return "";
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    setShowPicker(false);
    if (date) {
      setInputValue(getCurrentDateRange(date));
    }
  };

  const handleInputClick = () => {
    setShowPicker(true);
  };

  const fetchData = async () => {
    if (selectedDate) {
      const year = selectedDate.year();
      const month = selectedDate.month() + 1;
      const day = selectedDate.date();

      if (selectedView === "week") {
        const startOfWeek = selectedDate.startOf("week").add(1, "day");
        const weekStatistics: Statistic[] = [];

        for (let i = 0; i < 7; i++) {
          const currentDay = startOfWeek.add(i, "day");
          const response = await api.get(
            `/statistics?year=${currentDay.year()}&month=${currentDay.month() + 1}&day=${currentDay.date()}`
          );
          weekStatistics.push(...response.data.data);
        }

        setStatistics(weekStatistics);

        const total = weekStatistics.reduce((sum: number, stat: Statistic) => {
          return sum + stat.total_revenue;
        }, 0);
        setTotalRevenue(total);
      } else if (selectedView === "month") {
        const response = await api.get(
          `/statistics?year=${year}&month=${month}`
        );
        setStatistics(response.data.data);

        const total = response.data.data.reduce(
          (sum: number, stat: Statistic) => {
            return sum + stat.total_revenue;
          },
          0
        );
        setTotalRevenue(total);
      } else if (selectedView === "year") {
        const response = await api.get(`/statistics?year=${year}`);
        setStatistics(response.data.data);

        const total = response.data.data.reduce(
          (sum: number, stat: Statistic) => {
            return sum + stat.total_revenue;
          },
          0
        );
        setTotalRevenue(total);
      }
    }
  };

  const handleViewChange = (value: string) => {
    setSelectedView(value);
    setSelectedDate(null);
    setInputValue(getCurrentDateRange(dayjs()));
  };

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  useEffect(() => {
    setInputValue(getCurrentDateRange(dayjs()));
  }, [selectedView]);

  const chartData = statistics.map((stat) => ({
    date: `${stat.day}/${stat.month}/${stat.year}`,
    revenue: stat.total_revenue,
  }));

  const handleExportReport = () => {
    if (!selectedDate) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng Báo Cáo");

    // Header title
    worksheet.mergeCells("A2:D2");
    const reportCell2 = worksheet.getCell("A2");
    if (selectedView === "month") {
      reportCell2.value =
        "Tháng: " + (selectedDate?.month() + 1) + "/" + selectedDate?.year();
    } else if (selectedView === "year") {
      reportCell2.value = "Năm: " + selectedDate?.year();
    } else {
      reportCell2.value = "Tuần: " + getCurrentDateRange(selectedDate);
    }
    reportCell2.font = { bold: true };
    reportCell2.alignment = { vertical: "middle", horizontal: "center" };

    // Table headers
    worksheet.getRow(3).values = ["STT", "Ngày", "Số đơn hàng", "Doanh thu"];
    const headerRow = worksheet.getRow(3);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCEEFF" },
      };
      cell.alignment = { horizontal: "left" };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
      };
    });

    // Add data rows
    statistics.forEach((stat, index) => {
      worksheet.addRow([
        index + 1, // STT
        `${stat.day}/${stat.month}/${stat.year}`, // Ngày
        stat.total_order, // Số đơn hàng
        stat.total_revenue, // Doanh thu
      ]);
    });

    // Adjust column widths
    worksheet.columns = [
      { key: "no", width: 5 },
      { key: "date", width: 20 },
      { key: "total_order", width: 20 },
      { key: "total_revenue", width: 25 },
    ];

    // Export file
    const fileName = `Báo_Cáo_Doanh_Thu_${dayjs().format("YYYYMMDD")}.xlsx`;
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), fileName);
    });
  };

  return (
    <>
      <Card className="flex flex-col flex-1" x-chunk="dashboard-06-chunk-0">
        <CardContent className="flex flex-1 flex-col gap-6 mt-6">
          <div className="flex gap-x-5 items-center mb-4 relative">
            <div className="">
              <Input
                onClick={handleInputClick}
                value={inputValue}
                placeholder="Chọn ngày"
                className="w-full text-sm placeholder:text-gray-600"
                readOnly
              />
              {showPicker && (
                <SelectTime
                  setNewTime={handleDateChange}
                  value={selectedDate}
                  timeOption={selectedView}
                  handlerSetNewTime={handleDateChange}
                />
              )}
            </div>
            <Select defaultValue="week" onValueChange={handleViewChange}>
              <SelectTrigger className="border rounded p-2 w-20">
                <SelectValue placeholder="Tuần" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Tuần</SelectItem>
                <SelectItem value="month">Tháng</SelectItem>
                <SelectItem value="year">Năm</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={handleExportReport}
              className="bg-[#198754] text-white px-4 py-2 rounded"
            >
              Xuất Excel
            </button>
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
                  <TableCell>
                    {`${stat.day}/${stat.month}/${stat.year}`}
                  </TableCell>
                  <TableCell>{stat.total_order}</TableCell>
                  <TableCell>{formatNumber(stat.total_revenue)} VNĐ</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/50">
          <div className="mt-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Tổng doanh thu: {formatNumber(totalRevenue)} VNĐ
            </h2>
          </div>
          <TablePagination data={meta} onChange={setMeta} />
        </CardFooter>
      </Card>
      <ChartCard title="Doanh thu">
        <RevenueByDay data={chartData} />
      </ChartCard>
    </>
  );
}
