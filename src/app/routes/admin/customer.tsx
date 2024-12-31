import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody } from "@/components/ui/table";
import { Search } from "lucide-react";

import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { TablePagination } from "@/components/shared/table-pagination";
import { CustomerTableHeader } from "@/components/customer/customer-table-header";
import { CustomerTableRow } from "@/components/customer/customer-table-row";
import { useEffect, useState } from "react";
import { Customer } from "@/types/customer";
import customerService from "@/services/customer.service";
import { Meta } from "@/types/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyboardEvent } from "react";

export default function CustomerRoute() {
  const [customers, setCustomers] = useState<Array<Customer>>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [tabState, setTabState] = useState<string>("all");
  const [textSearch, setTextSearch] = useState<string>("");

  const fetchAllCustomer = async () => {
    let isDisable;
    if (tabState === "inactive") {
      isDisable = true;
    } else if (tabState === "active") {
      isDisable = false;
    } else {
      isDisable = null;
    }

    try {
      let response;
      if (textSearch) {
        response = await customerService.searchCustomer(isDisable, textSearch);
      } else {
        response = await customerService.getAllCusomter(
          {
            page: meta.page,
            take: meta.take,
          },
          isDisable
        );
      }
      setMeta(response.data.meta);
      setCustomers(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllCustomer();
  }, [meta.page, tabState]);

  const handleEnterPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await fetchAllCustomer();
    }
  };

  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#A93F15]">
          Danh Sách Khách Hàng
        </h1>
        <Tabs value={tabState}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTabState("all")}>
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="active" onClick={() => setTabState("active")}>
                Hoạt động
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                onClick={() => setTabState("inactive")}
              >
                Đã khóa
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardContent className="flex flex-col gap-6 mt-6">
            <div className="flex flex-row gap-4">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Nhập tên khách hàng"
                  className="w-full rounded-lg bg-background pl-8 focus:ring-0 focus:border-[#A93F15] focus:outline-0"
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                  onKeyDown={handleEnterPress}
                />
              </div>
              <Button className="bg-[#A93F15] hover:bg-[#FF7E00]">
                Áp dụng
              </Button>
            </div>
            <Table>
              <CustomerTableHeader />
              <TableBody>
                {customers.map((item, index) => {
                  return (
                    <CustomerTableRow
                      key={index}
                      data={item}
                      onRefetch={fetchAllCustomer}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <TablePagination data={meta} onChange={setMeta} />
          </CardFooter>
        </Card>
      </main>
    </DashBoardLayout>
  );
}
