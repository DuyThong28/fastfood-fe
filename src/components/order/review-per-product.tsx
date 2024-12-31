import image from "@/assets/placeholder.svg";
import { StarIcon } from "@heroicons/react/20/solid";
import { Textarea } from "../ui/textarea";
import { ResReview, Review } from "@/types/review";
import { useState } from "react";
import { ReviewStatus } from "@/common/enums";
import useUser from "@/hooks/useUser";
import { DEFAULT_AVATAR_URL } from "@/common/constants/user";

interface ReviewPerProductProps {
  data: Review | ResReview;
  onChange: (productId: string, name: string, value: string | number) => void;
  action: ReviewStatus;
}

export default function ReviewPerProduct({
  data,
  onChange,
  action,
}: ReviewPerProductProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [user] = useUser();

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-4">
        <div className="overflow-hidden rounded-md w-11 aspect-square">
          <img
            alt="Product image"
            className="object-cover w-full h-full"
            src={
              data?.product && data.product.image_url.length > 0
                ? data.product.image_url[0]
                : image
            }
          />
        </div>
        <div>{(data?.product && data?.product.title) || ""}</div>
      </div>
      {action === ReviewStatus.UNREVIEW && (
        <>
          <div className="flex items-center gap-x-2">
            <div className="text-[#A93F15] font-medium">
              Chất lượng sản phẩm:{" "}
            </div>
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => {
                return (
                  <StarIcon
                    key={rating}
                    aria-hidden="true"
                    className={((hoveredStar ?? data.rating) > rating
                      ? "text-gray-900"
                      : "text-gray-200"
                    ).concat(" h-4 w-4 flex-shrink-0")}
                    onMouseEnter={() => setHoveredStar(rating + 1)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={() =>
                      onChange((data as Review).productId, "rating", rating + 1)
                    }
                  />
                );
              })}
            </div>
          </div>
          <Textarea
            placeholder="Hãy chia sẻ những gì bạn thích về sản phẩm."
            value={data.description}
            onChange={(e) =>
              onChange(
                (data as Review).productId,
                "description",
                e.target.value
              )
            }
            disabled={action !== ReviewStatus.UNREVIEW}
          />
        </>
      )}
      {action !== ReviewStatus.UNREVIEW && (
        <>
          <div className="grid grid-cols-[44px_1fr] gap-4">
            <div className="overflow-hidden rounded-full w-11 aspect-square">
              <img
                alt="Avatar"
                className="object-cover w-full h-full"
                src={user?.avatar_url ?? DEFAULT_AVATAR_URL}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div>{user?.full_name}</div>
              <div className="flex">
                {[0, 1, 2, 3, 4].map((rating) => {
                  return (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={(data.rating > rating
                        ? "text-gray-900"
                        : "text-gray-200"
                      ).concat(" h-4 w-4 flex-shrink-0")}
                    />
                  );
                })}
              </div>
              <div className="text-[#A93F15] mt-2 font-medium">
                {data.description}
              </div>
            </div>
          </div>
        </>
      )}
      {(data as ResReview).ReplyReviews && (
        <div className="bg-muted p-4 rounded-md">
          <p className="mb-2">Phản hồi của người bán</p>
          <div>
            {(data as ResReview).ReplyReviews &&
              (data as ResReview).ReplyReviews?.reply}
          </div>
        </div>
      )}
    </div>
  );
}
