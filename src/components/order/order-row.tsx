import { Order } from "@/types/order";
import { Button } from "../ui/button";
import React from "react";
import { ORDER_STATUS } from "@/common/constants/order";
import { OrderStatus, ReviewStatus } from "@/common/enums";
import { useNavigate } from "react-router-dom";
import { ProductOrderRow } from "./product-order-row";
import SectionCard from "../shared/section-card";
import orderService from "@/services/order.service";

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
  const handleShowDetail = () => {
    navigate(`/customer/purchase/${data.id}`);
  };

  const handleCancelOrder = async () => {
    if (data.id) {
      try {
        await orderService.cancelOrder(data.id);
        await onRefetch();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <SectionCard>
      <div className="flex flex-row justify-between p-4">
        <span>{`Ma Don Hang: ${data.id}`}</span>
        <span>{ORDER_STATUS[data.status]}</span>
      </div>
      <div onClick={handleShowDetail}>
        {data.OrderItems.map((item, index) => {
          return <ProductOrderRow key={index} data={item} />;
        })}
      </div>
      <div className="w-full  flex flex-col gap-4 p-4 items-end">
        <div>{`Tong tien: ${data.total_price}`}</div>
        <div className="w-full flex flex-row">
          <div className="flex flex-row gap-4 ml-auto">
            {(data.status === OrderStatus.PENDING ||
              data.status === OrderStatus.PROCESSING) && (
              <Button variant="outline" onClick={handleCancelOrder}>
                Huy don hang
              </Button>
            )}
            {data.status === OrderStatus.SUCCESS &&
              data.review_state === ReviewStatus.UNREVIEW && (
                <Button
                  onClick={() => onReview(data.id, ReviewStatus.UNREVIEW)}
                >
                  Danh gia
                </Button>
              )}
            {data.status === OrderStatus.SUCCESS &&
              data.review_state === ReviewStatus.REVIEWED && (
                <Button
                  onClick={() => onReview(data.id, ReviewStatus.REVIEWED)}
                >
                  Xem danh gia
                </Button>
              )}
            {data.status === OrderStatus.SUCCESS &&
              data.review_state === ReviewStatus.REPLIED && (
                <Button onClick={() => onReview(data.id, ReviewStatus.REPLIED)}>
                  Xem phan hoi
                </Button>
              )}
            <Button
              variant="outline"
              onClick={() => onReview(data.id, ReviewStatus.REPLIED)}
            >
              Xem chi tiet
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};
