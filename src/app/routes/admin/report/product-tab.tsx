import { useState, useEffect } from "react";
import { TablePagination } from "@/components/shared/table-pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { ResProductDetail } from "@/types/product";
import { ProductTableHeader } from "@/components/product/product-table-header";
import { ProductTableRow } from "@/components/product/product-table-row";
import { ProductByDay } from "@/components/charts/product-by-day";
import { ChartCard } from "@/components/charts/chart-card";
import { api } from "@/lib/api-client";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  const [bestSeller, setBestSeller] = useState<ResProductDetail[]>([]);

  const getCurrentDateRange = (date: Dayjs) => {
    if (selectedView === "week") {
      const startOfWeek = date
        .startOf("week")
        .add(date.startOf("week").day() === 0 ? 1 : 0, "day");
      const endOfWeek = startOfWeek.add(6, "days");
      return {
        startDate: startOfWeek.format("YYYY-MM-DD"),
        endDate: endOfWeek.format("YYYY-MM-DD"),
      };
    } else if (selectedView === "month") {
      const startOfMonth = date.startOf("month");
      const endOfMonth = date.endOf("month");
      return {
        startDate: startOfMonth.format("YYYY-MM-DD"),
        endDate: endOfMonth.format("YYYY-MM-DD"),
      };
    } else if (selectedView === "year") {
      const startOfYear = date.startOf("year");
      const endOfYear = date.endOf("year");
      return {
        startDate: startOfYear.format("YYYY-MM-DD"),
        endDate: endOfYear.format("YYYY-MM-DD"),
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
    const currentDate = dayjs();
    setInputValue(formatInputValue(currentDate));
    setSelectedDate(currentDate);
    fetchData();
  };

  const fetchData = async () => {
    if (selectedDate) {
      const { startDate, endDate } = getCurrentDateRange(selectedDate);
      const modifiedEndDate = dayjs(endDate).add(1, "day").format("YYYY-MM-DD");
      try {
        const response = await api.get(
          `/statistics/soldProduct?start=${startDate}&end=${modifiedEndDate}`
        );
        setSoldProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching sold products:", error);
      }
    }
  };

  const fetchBestSeller = async () => {
    try {
      const response = await api.get(`/statistics/bestSeller`);
      setBestSeller(response.data.data);
    } catch (error) {
      console.error("Error fetching best seller:", error);
    }
  };

  const handleExportReport = () => {
    if (!selectedDate) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng Báo Cáo Sản Phẩm Bán");

    worksheet.mergeCells("A2:D2");
    const reportCell2 = worksheet.getCell("A2");
    if (selectedView === "month") {
      reportCell2.value =
        "Tháng: " + (selectedDate?.month() + 1) + "/" + selectedDate?.year();
    } else if (selectedView === "year") {
      reportCell2.value = "Năm: " + selectedDate?.year();
    } else {
      reportCell2.value = "Tuần: " + formatInputValue(selectedDate);
    }
    reportCell2.font = { bold: true };
    reportCell2.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.getRow(3).values = ["STT", "Tên sản phẩm", "Số bán ra"];
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

    worksheet.columns = [
      { key: "no", width: 5 },
      { key: "title", width: 30 },
      { key: "sold_quantity", width: 15 },
    ];

    soldProducts.forEach((product: any, index: number) => {
      worksheet.addRow({
        no: index + 1,
        title: product.product.title,
        sold_quantity: product.product.sold_quantity,
      });
    });

    const fileName = `Báo_Cáo_Sản_Phẩm_Bán_${dayjs().format("YYYYMMDD")}.xlsx`;
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), fileName);
    });
  };

  useEffect(() => {
    fetchBestSeller();
  }, []);

  useEffect(() => {
    const currentDate = dayjs();
    setSelectedDate(currentDate);
    setInputValue(formatInputValue(currentDate));
    fetchData();
  }, [selectedView]);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [selectedView]);

  return (
    <div className="flex flex-col w-full gap-y-5">
      <div className="flex flex-row gap-x-5">
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
                className="bg-[#A93F15] text-white px-4 py-2 rounded"
              >
                Xuất Excel
              </button>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-[#A93F15] font-semibold">
                  <TableCell>STT</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Số bán ra</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {soldProducts.map((product: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.product.title}</TableCell>
                    <TableCell>{product.product.sold_quantity}</TableCell>
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
      </div>
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold text-[#A93F15]">
            Top 5 sản phẩm bán chạy nhất
          </h3>
        </CardHeader>
        <CardContent>
          <Table>
            <ProductTableHeader onSort={() => {}} order="" sortBy="" />
            <TableBody>
              {bestSeller &&
                bestSeller.map((item, index) => {
                  return (
                    <ProductTableRow
                      key={index}
                      data={item}
                      onRefetch={fetchBestSeller}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
