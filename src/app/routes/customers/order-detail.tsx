import CustomerLayout from "@/components/layouts/customer-layout";
import orderService from "@/services/order.service";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Order } from "@/types/order";
import { useNavigate, useParams } from "react-router-dom";
import SectionCard from "@/components/shared/section-card";
import { ORDER_STATUS } from "@/common/constants/order";
import { OrderStatus, ReviewStatus } from "@/common/enums";
import { routes } from "@/config";
import { ProductOrderDetailRow } from "@/components/order/product-order-detail-row";
import { ProductOrderDetailHeader } from "@/components/order/product-order-detail-header";
import ReviewDialog, {
  ReviewDialogRef,
} from "@/components/order/review-dialog";
import { formatNumber } from "@/utils/format";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "@/components/shared/alert-dialog";
import { toastSuccess } from "@/utils/toast";

export default function OrderDetailRoute() {
  const param = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const reviewDialogRef = useRef<ReviewDialogRef>(null);
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);

  const getOrderById = async (id: string) => {
    try {
      const response = await orderService.getOrderDetail(id);
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
    navigate(routes.CUSTOMER.PURCHASE);
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
            toastSuccess("Đơn hàng đã được hủy");
            await getOrderById(orderDetail.id);
          } catch (err) {
            console.log(err);
          }
        },
      );
    }
  };

  const handleReview = (id: string, action: ReviewStatus) => {
    reviewDialogRef.current?.onOpen(id, action);
  };

  return (
    <CustomerLayout>
      {orderDetail && (
        <>
          <CustomAlertDialog ref={alertDialogRef} />
          <ReviewDialog
            ref={reviewDialogRef}
            onRefetch={() => getOrderById(orderDetail.id)}
          />
          <main className="flex flex-1 flex-col gap-6 py-6 pl-6">
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
            <SectionCard className="p-4 flex flex-row  items-center">
              <div>{ORDER_STATUS[orderDetail.status]}</div>
              {(orderDetail.status === OrderStatus.PENDING ||
                orderDetail.status === OrderStatus.PROCESSING) && (
                <Button
                  variant="outline"
                  className="ml-auto"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </Button>
              )}
              {orderDetail.status === OrderStatus.SUCCESS &&
                orderDetail.review_state === ReviewStatus.UNREVIEW && (
                  <Button
                    className="ml-auto"
                    onClick={() =>
                      handleReview(orderDetail.id, ReviewStatus.UNREVIEW)
                    }
                  >
                    Đánh giá
                  </Button>
                )}
              {orderDetail.status === OrderStatus.SUCCESS &&
                orderDetail.review_state === ReviewStatus.REVIEWED && (
                  <Button
                    className="ml-auto"
                    onClick={() =>
                      handleReview(orderDetail.id, ReviewStatus.REVIEWED)
                    }
                  >
                    Xem đánh giá
                  </Button>
                )}
              {orderDetail.status === OrderStatus.SUCCESS &&
                orderDetail.review_state === ReviewStatus.REPLIED && (
                  <Button
                    className="ml-auto"
                    onClick={() =>
                      handleReview(orderDetail.id, ReviewStatus.REPLIED)
                    }
                  >
                    Xem phản hồi
                  </Button>
                )}
            </SectionCard>
            <SectionCard className="p-4 space-y-4">
              <div className="font-medium">Địa chỉ nhận hàng</div>
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
                <div className="ml-auto font-medium">{`Tổng tiền hàng: ${formatNumber(
                  orderDetail.total_price,
                )}`}</div>
              </div>
            </SectionCard>
          </main>
        </>
      )}
    </CustomerLayout>
  );
}
