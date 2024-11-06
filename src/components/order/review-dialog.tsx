import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { FormEvent, forwardRef, useImperativeHandle, useState } from "react";
  import { Button } from "../ui/button";
  import ReviewPerProduct from "./review-per-product";
  import orderService from "@/services/order.service";
  import { Review } from "@/types/review";
  
  export interface ReviewDialogRef {
    onOpen: (id: string) => Promise<void>;
    onClose: () => void;
  }
  
  interface ReviewDialogProps {
    onRefetch: () => Promise<void>;
  }
  
  const ReviewDialog = forwardRef<ReviewDialogRef, ReviewDialogProps>(
    function ReviewDialog({ onRefetch }, ref) {
      const [isOpen, setIsOpen] = useState<boolean>(false);
      const [reviews, setReviews] = useState<Review[]>([]);
  
      const getOrderById = async (id: string) => {
        try {
          const response = await orderService.getOrderDetail(id);
          setReviews(
            response.data.data.OrderItems.map((item) => {
              return {
                orderId: id,
                orderDetailId: item.id,
                bookId: item.book_id,
                star: 0,
                description: undefined,
                title: "comment",
                book: item.book,
              };
            }),
          );
          setIsOpen(true);
        } catch (err) {
          console.log(err);
        }
      };
  
      useImperativeHandle(ref, () => {
        return {
          async onOpen(id: string) {
            await getOrderById(id);
          },
          onClose() {
            setIsOpen(false);
            setReviews([]);
          },
        };
      }, []);
      const reviewBook = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          await Promise.all(
            reviews.map((reivew) => orderService.reviewBook(reivew)),
          );
          setIsOpen(false);
          setReviews([]);
          await onRefetch();
        } catch (err) {
          console.log(err);
        }
      };
  
      const handleOnChangeInput = (
        bookId: string,
        name: string,
        value: string | number,
      ) => {
        setReviews((preState) =>
          preState.map((review) =>
            review.bookId === bookId ? { ...review, [name]: value } : review,
          ),
        );
      };
  
      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Danh gia</DialogTitle>
            </DialogHeader>
            <form className="space-y-6" onSubmit={reviewBook}>
              {reviews.map((item, index) => {
                return (
                  <ReviewPerProduct
                    key={index}
                    data={item}
                    onChange={handleOnChangeInput}
                  />
                );
              })}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Tro lai
                </Button>
                <Button type="submit">Hoan thanh</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      );
    },
  );
  
  export default ReviewDialog;
  