import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { OrderTableHeader } from "@/components/order/order-table-header";
import { OrderTableRow } from "@/components/order/order-table-row";
import { TablePagination } from "@/components/shared/table-pagination";
import { Order } from "@/types/order";
import { Meta } from "@/types/api";
import orderService from "@/services/order.service";
import { KeyboardEvent, useEffect, useState } from "react";
import { OrderStatus } from "@/common/enums";
import { ADMIN_ORDER_STATUS } from "@/common/constants/order";

export default function OrderRoute() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 2,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [tabState, setTabState] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const getOrdersByAdmin = async () => {
    try {
      const response = await orderService.getOrdersByAdmin(
        {
          page: meta.page,
          take: meta.take,
        },
        tabState,
        searchText,
      );
      setOrders(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrdersByAdmin();
  }, [meta.page, tabState]);

  const handleEnterPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await getOrdersByAdmin();
    }
  };

  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <h1 className="text-lg font-semibold">Danh Sach Don Hang</h1>
        <Tabs value={tabState}>
          <TabsList>
            <TabsTrigger value="all" onClick={() => setTabState("all")}>
              Tat ca
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.PENDING}
              onClick={() => setTabState(OrderStatus.PENDING)}
            >
              {ADMIN_ORDER_STATUS.PENDING}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.PROCESSING}
              onClick={() => setTabState(OrderStatus.PROCESSING)}
            >
              {ADMIN_ORDER_STATUS.PROCESSING}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.DELIVERED}
              onClick={() => setTabState(OrderStatus.DELIVERED)}
            >
              {ADMIN_ORDER_STATUS.DELIVERED}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.SUCCESS}
              onClick={() => setTabState(OrderStatus.SUCCESS)}
            >
              {ADMIN_ORDER_STATUS.SUCCESS}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.CANCELLED}
              onClick={() => setTabState(OrderStatus.CANCELLED)}
            >
              {ADMIN_ORDER_STATUS.CANCELLED}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.REJECT}
              onClick={() => setTabState(OrderStatus.REJECT)}
            >
              {ADMIN_ORDER_STATUS.REJECT}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardContent className="flex flex-col gap-6 mt-6">
            <div className="flex flex-row gap-4">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Nhap ma don hang"
                  className="w-full rounded-lg bg-background pl-8"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleEnterPress}
                />
              </div>
              <Button  onClick={async () => getOrdersByAdmin()}>Ap dung</Button>
            </div>
            <div className="space-y-4">
              <OrderTableHeader />
              {orders.map((item, index) => {
                return <OrderTableRow key={index} data={item} />;
              })}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <TablePagination data={meta} onChange={setMeta} />
          </CardFooter>
        </Card>
      </main>
    </DashBoardLayout>
  );
}
