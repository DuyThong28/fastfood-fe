import { useState, useEffect } from "react";
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
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import SelectTime from "@/components/shared/date-calendar";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ProductByDay } from "@/components/charts/product-by-day";
import { ChartCard } from "@/components/charts/chart-card";
import { api } from "@/lib/api-client";

export default function ProductTab() {
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedView, setSelectedView] = useState("week");
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [soldProducts, setSoldProducts] = useState<any>([]);

  const getCurrentDateRange = (date: Dayjs) => {
    if (selectedView === "week") {
      const startOfWeek = date
        .startOf("week")
        .add(date.startOf("week").day() === 0 ? 1 : 0, "day");
      const endOfWeek = startOfWeek.add(6, "days");
      return {
        startDate: startOfWeek.format("YYYY-MM-DD"),
        endDate: endOfWeek.add(1, "day").format("YYYY-MM-DD"),
      };
    } else if (selectedView === "month") {
      const startOfMonth = date.startOf("month");
      const endOfMonth = date.endOf("month");
      return {
        startDate: startOfMonth.format("YYYY-MM-DD"),
        endDate: endOfMonth.add(1, "day").format("YYYY-MM-DD"),
      };
    } else if (selectedView === "year") {
      const startOfYear = date.startOf("year");
      const endOfYear = date.endOf("year");
      return {
        startDate: startOfYear.format("YYYY-MM-DD"),
        endDate: endOfYear.add(1, "day").format("YYYY-MM-DD"),
      };
    }
    return { startDate: "", endDate: "" };
  };

  const formatInputValue = (date: Dayjs) => {
    if (selectedView === "week") {
      const { startDate, endDate } = getCurrentDateRange(date);
      return `${dayjs(startDate).format("DD/MM/YYYY")} - ${dayjs(endDate).format("DD/MM/YYYY")}`;
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
      setInputValue(formatInputValue(date));
    }
  };

  const handleInputClick = () => {
    setShowPicker(true);
  };

  const handleViewChange = (value: string) => {
    setSelectedView(value);
    if (selectedDate) {
      setInputValue(formatInputValue(selectedDate));
    }
  };

  const fetchData = async () => {
    if (selectedDate) {
      const { startDate, endDate } = getCurrentDateRange(selectedDate);
      try {
        const response = await api.get(
          `/statistics/soldProduct?start=${startDate}&end=${endDate}`
        );
        setSoldProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching sold products:", error);
      }
    }
  };

  useEffect(() => {
    const currentDate = dayjs();
    setSelectedDate(currentDate);
    setInputValue(formatInputValue(currentDate));
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [selectedView]);

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
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Số bán ra</TableCell>
                <TableCell>Số còn lại</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {soldProducts.map((product: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.product.title}</TableCell>
                  <TableCell>{product.product.sold_quantity}</TableCell>
                  <TableCell>{product.product.stock_quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/50">
          <TablePagination data={meta} onChange={setMeta} />
        </CardFooter>
      </Card>
      <ChartCard title="Số lượng sản phẩm bán ra">
        <ProductByDay
          data={soldProducts.map((product: any) => ({
            name: product.product.title,
            numberOfProducts: product.product.sold_quantity,
          }))}
        />
      </ChartCard>
    </>
  );
}
