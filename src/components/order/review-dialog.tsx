import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import ReviewPerProduct from "./review-per-product";
import orderService from "@/services/order.service";
import { ResReview, Review } from "@/types/review";
import reviewService from "@/services/review.service";
import { ReviewStatus } from "@/common/enums";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "../shared/alert-dialog";
import { toastSuccess, toastWarning } from "@/utils/toast";

export interface ReviewDialogRef {
  onOpen: (id: string, action: ReviewStatus) => Promise<void>;
  onClose: () => void;
}

interface ReviewDialogProps {
  onRefetch: () => Promise<void>;
}

const ReviewDialog = forwardRef<ReviewDialogRef, ReviewDialogProps>(
  function ReviewDialog({ onRefetch }, ref) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [reviews, setReviews] = useState<Review[] | ResReview[]>([]);
    const [action, setAction] = useState<ReviewStatus>(ReviewStatus.UNREVIEW);
    const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);

    const getOrderById = async (id: string) => {
      try {
        const response = await orderService.getOrderDetail(id);
        setReviews(
          response.data.data.OrderItems.map((item) => {
            return {
              orderId: id,
              orderDetailId: item.id,
              productId: item.product_id,
              rating: 0,
              description: undefined,
              title: "comment",
              product: item.product,
            };
          })
        );
        setIsOpen(true);
      } catch (err) {
        console.log(err);
      }
    };

    const getReviewsByOrderId = async (id: string) => {
      try {
        const response = await reviewService.getReviewsByOrderId(id);
        console.log(response);
        (setReviews as Dispatch<SetStateAction<ResReview[]>>)(
          response.data.data
        );
        setIsOpen(true);
      } catch (err) {
        console.log(err);
      }
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          async onOpen(id: string, action: ReviewStatus) {
            setAction(action);
            if (action === ReviewStatus.UNREVIEW) {
              await getOrderById(id);
            } else {
              await getReviewsByOrderId(id);
            }
          },
          onClose() {
            setIsOpen(false);
          },
        };
      },
      []
    );

    const reviewProduct = async () => {
      const unreviewItem = reviews.find(
        (item) => item.rating < 1 || !item.description?.trim()
      );
      if (unreviewItem) {
        if (unreviewItem.rating < 1 && !unreviewItem.description?.trim())
          toastWarning("Vui lòng đánh giá sản phẩm");
        else if (unreviewItem.rating < 1)
          toastWarning("Vui lòng chọn sao đánh giá");
        else if (!unreviewItem.description?.trim())
          toastWarning("Vui lòng đánh giá sản phẩm");
        return;
      }

      alertDialogRef.current?.onOpen(
        {
          title: `Xác nhận đánh giá?`,
          description:
            "Một khi đã xác nhận, bạn sẽ không thể chỉnh sửa đánh giá này.",
        },
        async () => {
          try {
            await Promise.all(
              (reviews as Review[]).map((reivew) =>
                orderService.reviewProduct(reivew)
              )
            );
            toastSuccess("Đánh giá thành công");
            setIsOpen(false);
            setReviews([]);
            await onRefetch();
          } catch (err) {
            console.log(err);
          }
        }
      );
    };

    const handleOnChangeInput = (
      productId: string,
      name: string,
      value: string | number
    ) => {
      (setReviews as Dispatch<SetStateAction<Review[]>>)((preState) =>
        preState.map((review) =>
          review.productId === productId ? { ...review, [name]: value } : review
        )
      );
    };

    return (
      <>
        <CustomAlertDialog ref={alertDialogRef} />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[425px] max-h-[80%] flex flex-col">
            <DialogHeader className="flex-none">
              <DialogTitle>Đánh Giá</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto flex-1 flex flex-col gap-6 p-1">
              {reviews.map((item, index) => {
                return (
                  <ReviewPerProduct
                    key={index}
                    data={item}
                    onChange={handleOnChangeInput}
                    action={action}
                  />
                );
              })}
            </div>
            <div className="flex flex-row gap-4 justify-end flex-none">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  setReviews([]);
                  setIsOpen(false);
                }}
              >
                Trở lại
              </Button>
              {action === ReviewStatus.UNREVIEW && (
                <Button type="button" onClick={reviewProduct} className="w-1/2">
                  Hoàn thành
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

export default ReviewDialog;
