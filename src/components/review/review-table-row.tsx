import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import image from "@/assets/placeholder.svg";
import { MessageSquareReply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResReviewOfAdmin } from "@/types/review";
import { REVIEW_sTATUS } from "@/common/constants";
import { dateToVNString } from "@/utils/format";
import { ReviewStatus } from "@/common/enums";
import { DEFAULT_AVATAR_URL } from "@/common/constants/user";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useRef, useState } from "react";
import CustomAlertDialog, { CustomAlertDialogRef } from "../shared/alert-dialog";
import { toastSuccess } from "@/utils/toast";
import reviewService from "@/services/review.service";
interface ReviewTableRowProps {
  data: ResReviewOfAdmin;
  onReply: () => void;
  onRefetch: () => Promise<void>;
}

export const ReviewTableRow: React.FC<ReviewTableRowProps> = ({
  data,
  onReply,
  onRefetch,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);
  const handleHide = async () => {
    alertDialogRef.current?.onOpen(
      {
        title: `Bạn có chắc chắn muốn ẩn danh mục này?`,
        description:
          "Sau khi ẩn, bình luận sẽ không hiển thị trên trang sản phẩm cho đến khi nó được kích hoạt lại.",
      },
      async () => {
        try {
          await reviewService.hideReview(data.id);
          toastSuccess("Ẩn bình luận thành công");
          await onRefetch();
          setIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      }
    );
  };

  const handleShow = async () => {
    alertDialogRef.current?.onOpen(
      {
        title: `Bạn có chắc chắn muốn hiển thị bình luận này?`,
        description:
          "Sau khi kích hoạt, bình luận sẽ xuất hiện trên trang sản phẩm.",
      },
      async () => {
        try {
          await reviewService.showReview(data.id);
          toastSuccess("Kích hoạt danh mục thành công");
          await onRefetch();
          setIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      }
    );
  };
  return (
    <>
      <CustomAlertDialog ref={alertDialogRef} />
      <TableRow>
        <TableCell>{data.OrderItem.order_id}</TableCell>
        <TableCell className="font-medium flex flex-row gap-4 items-center">
          <img
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={
              (data.product.image_url.length > 0 &&
                data.product.image_url[0]) ||
              image
            }
            width="64"
          />
          {data.product.title}
        </TableCell>
        <TableCell>{data.rating}</TableCell>
        <TableCell>{data.description}</TableCell>
        <TableCell>
          {" "}
          {data.type === "NEGATIVE" ? "tiêu cực" : "Tích cực"}
        </TableCell>
        <TableCell> {data.is_hidden ? "Bị ẩn" : "Hiển thị"}</TableCell>
        <TableCell>
          <div className="flex flex-row gap-2 items-center">
            <div className="w-5 h-5 aspect-square rounded-full overflow-hidden">
              <img
                alt="avt"
                className="w-full h-full object-cover"
                src={data.user.avatar_url || DEFAULT_AVATAR_URL}
              />
            </div>
            <span>{data.user.full_name}</span>
          </div>
        </TableCell>
        <TableCell>{dateToVNString(new Date(data.created_at))}</TableCell>
        <TableCell>
          {(data.ReplyReviews && data.ReplyReviews.reply) || ""}
        </TableCell>
        <TableCell
          className="w-[130px]  sticky right-[97px] bg-gray-50 z-10"
          style={{
            transform: "translateX(20px)",
          }}
        >
          <Badge variant="outline">{REVIEW_sTATUS[data.state]}</Badge>
        </TableCell>
        <TableCell className="w-[100px]  sticky right-0 bg-gray-50 z-10">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-1">
              {data.state === ReviewStatus.UNREVIEW && (
                <div
                  className="py-2 px-3 w-full hover:bg-[#F4F4F5]"
                  onClick={onReply}
                >
                  Phản hồi
                </div>
              )}
              {data.is_hidden ? (
                <div
                  className="py-2 px-3 w-full hover:bg-[#F4F4F5]"
                  onClick={handleShow}
                >
                  Hiển thị
                </div>
              ) : (
                <div
                  className="py-2 px-3 w-full hover:bg-[#F4F4F5]"
                  onClick={handleHide}
                >
                  Ẩn
                </div>
              )}
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    </>
  );
};
