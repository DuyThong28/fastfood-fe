import { Order } from "@/types/order";
import { Button } from "../ui/button";
import React, { useRef } from "react";
import { ORDER_STATUS } from "@/common/constants/order";
import { OrderStatus, ReviewStatus } from "@/common/enums";
import { useNavigate } from "react-router-dom";
import { ProductOrderRow } from "./product-order-row";
import SectionCard from "../shared/section-card";
import orderService from "@/services/order.service";
import { formatNumber } from "@/utils/format";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "../shared/alert-dialog";
import { toastSuccess } from "@/utils/toast";

interface OrderRowProps {
  data: Order;
  onRefetch: () => Promise<void>;
  onReview: (id: string, action: ReviewStatus) => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({
  data,
  onRefetch,
  onReview,
}) => {
  const navigate = useNavigate();
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);
  const handleShowDetail = () => {
    navigate(`/customer/purchase/${data.id}`);
  };

  const handleCancelOrder = async () => {
    if (data.id) {
      alertDialogRef.current?.onOpen(
        {
          title: `Bạn có chắc chắn muốn hủy đơn hàng không?`,
          description: "Bạn sẽ cần đặt lại đơn hàng nếu muốn tiếp tục mua sắm.",
        },
        async () => {
          try {
            await orderService.cancelOrder(data.id);
            toastSuccess("Đơn hàng đã được hủy");
            await onRefetch();
          } catch (err) {
            console.log(err);
          }
        }
      );
    }
  };

  const handlePay = async () => {
    if (!data.payment_url) {
      const paymentRespone = await orderService.createMOMOURL(data.id);
      if (paymentRespone && paymentRespone.data.data.payUrl) {
        window.location.href = paymentRespone.data.data.payUrl;
      }
    } else window.location.href = data.payment_url;
  };

  return (
    <>
      <CustomAlertDialog ref={alertDialogRef} />
      <SectionCard>
        <div className="flex flex-row md:text-base text-xs justify-between p-4 text-[#A93F15] font-semibold">
          <span>{`Mã đơn hàng: ${data.id}`}</span>
          <span className="text-right">{ORDER_STATUS[data.status]}</span>
        </div>
        <div onClick={handleShowDetail}>
          {data.OrderItems.map((item, index) => {
            return <ProductOrderRow key={index} data={item} />;
          })}
        </div>
        <div className="w-full  flex flex-col gap-4 p-4 items-end">
          <div className="font-semibold text-[#FF7E00]">{`Tổng tiền: ${formatNumber(data.total_price)} đ`}</div>
          <div className="w-full flex flex-row">
            <div className="flex flex-row gap-4 ml-auto">
              {data.status === OrderStatus.PENDING && (
                <Button
                  variant="default"
                  className="bg-[#A93F15] hover:bg-[#FF7E00]"
                  onClick={handlePay}
                >
                  Thanh toán
                </Button>
              )}
              {((data.status === OrderStatus.PROCESSING &&
                data.payment_method == "CASH") ||
                data.status === OrderStatus.PENDING) && (
                <Button
                  variant="outline"
                  className="text-[#A93F15] hover:text-[#A93F15]"
                  onClick={handleCancelOrder}
                >
                  Hủy đơn hàng
                </Button>
              )}
              {data.status === OrderStatus.SUCCESS &&
                data.review_state === ReviewStatus.UNREVIEW && (
                  <Button
                    className="bg-[#A93F15] hover:bg-[#FF7E00]"
                    onClick={() => onReview(data.id, ReviewStatus.UNREVIEW)}
                  >
                    Đánh giá
                  </Button>
                )}
              {data.status === OrderStatus.SUCCESS &&
                data.review_state === ReviewStatus.REVIEWED && (
                  <Button
                    className="bg-[#A93F15] hover:bg-[#FF7E00]"
                    onClick={() => onReview(data.id, ReviewStatus.REVIEWED)}
                  >
                    Xem đánh giá
                  </Button>
                )}
              {data.status === OrderStatus.SUCCESS &&
                data.review_state === ReviewStatus.REPLIED && (
                  <Button
                    className="bg-[#A93F15] hover:bg-[#FF7E00]"
                    onClick={() => onReview(data.id, ReviewStatus.REPLIED)}
                  >
                    Xem phản hồi
                  </Button>
                )}
              <Button
                variant="outline"
                className="text-[#A93F15] hover:text-[#A93F15]"
                onClick={handleShowDetail}
              >
                Xem chi tiết
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>
    </>
  );
};
