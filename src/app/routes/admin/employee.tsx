import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody } from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";

import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { TablePagination } from "@/components/shared/table-pagination";
import { CustomerTableHeader } from "@/components/customer/customer-table-header";
import { useCallback, useEffect, useState } from "react";
import { Meta } from "@/types/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyboardEvent } from "react";
import { EmployeeTableRow } from "@/components/employee/employee-table-row";
import { useNavigate } from "react-router-dom";
import userService from "@/services/user.service";
import { resEmployee } from "@/types/user";
import { routes } from "@/config";

export default function EmployeeRoute() {
    const navigate = useNavigate()
  const [employees, setEmployees] = useState<Array<resEmployee>>([]);
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

  const fetchAllCustomer = useCallback(async () => {
    let isDisable;
    if (tabState === "inactive") {
      isDisable = true;
    } else if (tabState === "active") {
      isDisable = false;
    } else {
      isDisable = null;
    }
    console.log("isDisable",isDisable)
    try {
      let response;
      if (textSearch) {
        response = await userService.searchStaff(isDisable, textSearch);
      } else {
        response = await userService.getAllStaff(
          {
            page: meta.page,
            take: meta.take,
          },
          isDisable,
        );
      }
      setMeta(response.data.meta);
      setEmployees(response.data.data);
    } catch (err) {
      console.log(err);
    }
  },[meta.page, meta.take, tabState, textSearch]);

  useEffect(() => {
    fetchAllCustomer();
  }, [fetchAllCustomer, meta.page, tabState]);

  const handleEnterPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await fetchAllCustomer();
    }
  };


  return (
    <DashBoardLayout>
          <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
              <div className="flex">
                  <h1 className="text-lg font-semibold">Danh Sach Nhan vien</h1>
              <Button
            className="gap-1 ml-auto"
            onClick={() => navigate(routes.ADMIN.ADD_EMPLOYEE)}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Them nhan vien moi</span>
          </Button>
              </div>
        <Tabs value={tabState}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTabState("all")}>
                Tat ca
              </TabsTrigger>
              <TabsTrigger value="active" onClick={() => setTabState("active")}>
                Hoat dong
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                onClick={() => setTabState("inactive")}
              >
                Da khoa
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
                  placeholder="Nhap ten khach hang"
                  className="w-full rounded-lg bg-background pl-8"
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                  onKeyDown={handleEnterPress}
                />
              </div>
              <Button>Ap dung</Button>
            </div>
            <Table>
              <CustomerTableHeader />
              <TableBody>
                {employees.map((item, index) => {
                  return (
                    <EmployeeTableRow
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
