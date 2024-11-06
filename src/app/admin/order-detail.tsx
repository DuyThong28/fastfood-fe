import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Order } from "@/types/order";
import orderService from "@/services/order.service";
import { useEffect, useState } from "react";
import SectionCard from "@/components/shared/section-card";
import { ADMIN_ORDER_STATUS } from "@/common/constants/order";
import { OrderStatus } from "@/common/enums";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "@/config";
import { ProductOrderDetailRow } from "@/components/order/product-order-detail-row";
import { ProductOrderDetailHeader } from "@/components/order/product-order-detail-header";

export default function AdminOrderDetailRoute() {
  const param = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);

  const getOrderById = async (id: string) => {
    try {
      const response = await orderService.getOrderDetailByAdMin(id);
      setOrderDetail(response.data.data);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (param?.orderId) {
      getOrderById(param.orderId);
    }
  }, [param]);

  const handleBack = () => {
    navigate(routes.ADMIN.ORDER);
  };

  const handleCancelOrder = async () => {
    if (orderDetail?.id) {
      try {
        await orderService.cancelOrder(orderDetail.id);
        await getOrderById(orderDetail.id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (orderDetail?.id) {
        try {
          if (orderDetail.status === OrderStatus.PENDING)
            await orderService.updateOrderStatus({
              id: orderDetail.id,
              status: OrderStatus.PROCESSING,
            });
          else if (orderDetail.status === OrderStatus.PROCESSING)
            await orderService.updateOrderStatus({
              id: orderDetail.id,
              status: OrderStatus.DELIVERED,
            });
          else if (orderDetail.status === OrderStatus.DELIVERED)
            await orderService.updateOrderStatus({
              id: orderDetail.id,
              status: OrderStatus.SUCCESS,
            });
          await getOrderById(orderDetail.id);
        } catch (err) {
          console.log(err);
        }
      }
  };

  return (
    <DashBoardLayout>
      {orderDetail && (
        <main className="flex flex-1 flex-col gap-6 p-6 bg-muted/40 overflow-y-auto">
          <SectionCard className="flex flex-row items-center p-4 gap-1">
            <div
              onClick={handleBack}
              className="hover:cursor-pointer flex flexp-row gap-1 items-center"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>TRỞ LẠI</span>
            </div>
            <span className="ml-auto">{`MÃ ĐƠN HÀNG: ${orderDetail.id}`}</span>
          </SectionCard>
          <SectionCard className="p-4 flex flex-row gap-4 items-center">
            <div>{ADMIN_ORDER_STATUS[orderDetail.status]}</div>
            {(orderDetail.status === OrderStatus.PENDING ||
              orderDetail.status === OrderStatus.PROCESSING) && (
              <Button
                variant="outline"
                className="ml-auto"
                onClick={handleCancelOrder}
              >
                Huy don hang
              </Button>
            )}
            {orderDetail.status === OrderStatus.PENDING && (
              <Button onClick={handleUpdateOrderStatus}>Chuan bi hang</Button>
            )}
            {orderDetail.status === OrderStatus.PROCESSING && (
              <Button onClick={handleUpdateOrderStatus}>San sang giao</Button>
            )}
            {orderDetail.status === OrderStatus.DELIVERED && (
              <Button className="ml-auto" onClick={handleUpdateOrderStatus}>
                Da giao hang
              </Button>
            )}
          </SectionCard>
          <SectionCard className="p-4 space-y-4">
            <div className="font-medium">Địa chỉ nhận hàng</div>
            <div className="space-y-2 text-muted-foreground">
              <div>{`Nguoi nhan: ${orderDetail.full_name}`}</div>
              <div>{`So dien thoai: ${orderDetail.phone_number}`}</div>
              <div>{`Dia chi: ${orderDetail.address}`}</div>
            </div>
          </SectionCard>
          <SectionCard className="p-2">
            <ProductOrderDetailHeader />
            <div>
              {orderDetail.OrderItems.map((item, index) => {
                return (
                  <ProductOrderDetailRow
                    key={index}
                    data={item}
                    onShowBookDetail={() => navigate(`/book/${item.book_id}`)}
                  />
                );
              })}
            </div>
            <div className="flex p-4">
              <div className="ml-auto font-medium">{`Tong tien hang: ${orderDetail.total_price}`}</div>
            </div>
          </SectionCard>
        </main>
      )}
    </DashBoardLayout>
  );
}
