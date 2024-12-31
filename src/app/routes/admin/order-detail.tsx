import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Order } from "@/types/order";
import orderService from "@/services/order.service";
import { useEffect, useRef, useState } from "react";
import SectionCard from "@/components/shared/section-card";
import {
  ADMIN_ORDER_STATUS,
  ORDER_ACTION_DESCRIPTION,
  ORDER_ACTION_TITLE,
} from "@/common/constants/order";
import { OrderStatus } from "@/common/enums";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "@/config";
import { ProductOrderDetailRow } from "@/components/order/product-order-detail-row";
import { ProductOrderDetailHeader } from "@/components/order/product-order-detail-header";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "@/components/shared/alert-dialog";
import { toastSuccess } from "@/utils/toast";

export default function AdminOrderDetailRoute() {
  const param = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);

  const getOrderById = async (id: string) => {
    try {
      const response = await orderService.getOrderDetailByAdMin(id);
      setOrderDetail(response.data.data);
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
      alertDialogRef.current?.onOpen(
        {
          title: `Bạn có chắc chắn muốn hủy đơn hàng không?`,
          description: "Bạn sẽ cần đặt lại đơn hàng nếu muốn tiếp tục mua sắm.",
        },
        async () => {
          try {
            await orderService.cancelOrder(orderDetail.id);
            await getOrderById(orderDetail.id);
            toastSuccess("Hủy đơn hàng thành công");
          } catch (err) {
            console.log(err);
          }
        }
      );
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (
      orderDetail?.id &&
      (orderDetail.status === OrderStatus.PENDING ||
        orderDetail.status === OrderStatus.PROCESSING ||
        orderDetail.status === OrderStatus.DELIVERED)
    ) {
      alertDialogRef.current?.onOpen(
        {
          title: ORDER_ACTION_TITLE[orderDetail.status],
          description: ORDER_ACTION_DESCRIPTION[orderDetail.status],
        },
        async () => {
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
            toastSuccess("Cập nhật trạng thái đơn hàng thành công");
            await getOrderById(orderDetail.id);
          } catch (err) {
            console.log(err);
          }
        }
      );
    }
  };

  return (
    <DashBoardLayout>
      {orderDetail && (
        <>
          <CustomAlertDialog ref={alertDialogRef} />
          <main className="flex flex-1 flex-col gap-6 p-6 bg-muted/40 overflow-y-auto">
            <SectionCard className="flex flex-row items-center p-4 gap-1">
              <div
                onClick={handleBack}
                className="hover:cursor-pointer flex flexp-row gap-1 items-center"
              >
                <ChevronLeft className="h-5 w-5 text-[#A93F15]" />
                <span className="text-[#A93F15] font-semibold">TRỞ LẠI</span>
              </div>
              <span className="ml-auto text-[#A93F15] font-semibold">{`MÃ ĐƠN HÀNG: ${orderDetail.id}`}</span>
            </SectionCard>
            <SectionCard className="p-4 flex flex-row gap-4 items-center">
              <div className="text-[#A93F15] font-semibold">
                {ADMIN_ORDER_STATUS[orderDetail.status]}
              </div>
              {(orderDetail.status === OrderStatus.PENDING ||
                orderDetail.status === OrderStatus.PROCESSING) && (
                <Button
                  variant="outline"
                  className="ml-auto text-[#A93F15] hover:text-[#A93F15]"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </Button>
              )}
              {orderDetail.status === OrderStatus.PENDING && (
                <Button
                  onClick={handleUpdateOrderStatus}
                  className="bg-[#A93F15] hover:bg-[#FF7E00]"
                >
                  Chuẩn bị hàng
                </Button>
              )}
              {orderDetail.status === OrderStatus.PROCESSING && (
                <Button
                  onClick={handleUpdateOrderStatus}
                  className="bg-[#A93F15] hover:bg-[#FF7E00]"
                >
                  Sẵn sàng giao
                </Button>
              )}
              {orderDetail.status === OrderStatus.DELIVERED && (
                <Button
                  className="ml-auto bg-[#A93F15] hover:bg-[#FF7E00]"
                  onClick={handleUpdateOrderStatus}
                >
                  Đã giao hàng
                </Button>
              )}
            </SectionCard>
            <SectionCard className="p-4 space-y-4">
              <div className="text-[#A93F15] font-semibold">
                Địa chỉ nhận hàng
              </div>
              <div className="space-y-2 text-muted-foreground">
                <div>{`Người nhận: ${orderDetail.full_name}`}</div>
                <div>{`Số điện thoại: ${orderDetail.phone_number}`}</div>
                <div>{`Địa chỉ: ${orderDetail.address}`}</div>
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
                      onShowProductDetail={() =>
                        navigate(`/product/${item.product_id}`)
                      }
                    />
                  );
                })}
              </div>
              <div className="flex p-4">
                <div className="ml-auto font-semibold text-[#A93F15]">{`Tổng tiền hàng: ${orderDetail.total_price}`}</div>
              </div>
            </SectionCard>
          </main>
        </>
      )}
    </DashBoardLayout>
  );
}
