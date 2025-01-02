import CustomerLayout from "@/components/layouts/customer-layout";
import orderService from "@/services/order.service";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { TablePagination } from "@/components/shared/table-pagination";
import { Meta } from "@/types/api";
import { Order } from "@/types/order";
import { OrderRow } from "@/components/order/order-row";
import { OrderStatus, ReviewStatus } from "@/common/enums";
import { ORDER_STATUS } from "@/common/constants/order";
import ReviewDialog, {
  ReviewDialogRef,
} from "@/components/order/review-dialog";

export default function PurchaseRoute() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [tabState, setTabState] = useState<string>("all");
  const reviewDialogRef = useRef<ReviewDialogRef>(null);
  const [searchText, setSearchText] = useState<string>("");

  const getAllOrdersByUser = async () => {
    try {
      const response = await orderService.getOrdersByUser(
        {
          page: meta.page,
          take: meta.take,
        },
        tabState,
        searchText.trim()
      );
      setOrders(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllOrdersByUser();
  }, [meta.page, tabState]);

  const handleReview = (id: string, action: ReviewStatus) => {
    reviewDialogRef.current?.onOpen(id, action);
  };

  const handleEnterPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await getAllOrdersByUser();
    }
  };

  return (
    <CustomerLayout>
      <ReviewDialog ref={reviewDialogRef} onRefetch={getAllOrdersByUser} />
      <main className="flex flex-1 flex-col gap-6 py-6 pl-6">
        <Tabs value={tabState} className="mx-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setTabState("all")}>
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.PENDING}
              onClick={() => setTabState(OrderStatus.PENDING)}
            >
              {ORDER_STATUS.PENDING}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.PROCESSING}
              onClick={() => setTabState(OrderStatus.PROCESSING)}
            >
              {ORDER_STATUS.PROCESSING}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.DELIVERED}
              onClick={() => setTabState(OrderStatus.DELIVERED)}
            >
              {ORDER_STATUS.DELIVERED}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.SUCCESS}
              onClick={() => setTabState(OrderStatus.SUCCESS)}
            >
              {ORDER_STATUS.SUCCESS}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.CANCELLED}
              onClick={() => setTabState(OrderStatus.CANCELLED)}
            >
              {ORDER_STATUS.CANCELLED}
            </TabsTrigger>
            <TabsTrigger
              value={OrderStatus.REJECT}
              onClick={() => setTabState(OrderStatus.REJECT)}
            >
              {ORDER_STATUS.REJECT}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-row gap-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Nhập mã đơn hàng"
              className="w-full rounded-lg bg-background pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleEnterPress}
            />
          </div>
          <Button
            className="bg-[#A93F15] hover:bg-[#FF7E00]"
            onClick={async () => getAllOrdersByUser()}
          >
            Áp dụng
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {orders.map((item, index) => {
            return (
              <OrderRow
                key={index}
                data={item}
                onRefetch={getAllOrdersByUser}
                onReview={handleReview}
              />
            );
          })}
        </div>
        <TablePagination data={meta} onChange={setMeta} />
      </main>
    </CustomerLayout>
  );
}
