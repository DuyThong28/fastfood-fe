import image from "@/assets/placeholder.svg";
import { StarIcon } from "@heroicons/react/20/solid";
import { Textarea } from "../ui/textarea";
import { Review } from "@/types/review";
import { useState } from "react";

interface ReviewPerProductProps {
  data: Review;
  onChange: (bookId: string, name: string, value: string | number) => void;
}

export default function ReviewPerProduct({
  data,
  onChange,
}: ReviewPerProductProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-4">
        <div className="overflow-hidden rounded-md w-11 aspect-square">
          <img
            alt="Product image"
            className="object-cover w-full h-full"
            src={
              data?.book && data.book.image_url.length > 0
                ? data.book.image_url[0]
                : image
            }
          />
        </div>
        <div>{(data?.book && data?.book.title) || ""}</div>
      </div>
      <div className="flex items-center">
        <div>Chat luong san pham: </div>
        <div className="flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              aria-hidden="true"
              className={((hoveredStar ?? data.star) > rating
                ? "text-gray-900"
                : "text-gray-200"
              ).concat(" h-4 w-4 flex-shrink-0")}
              onMouseEnter={() => setHoveredStar(rating + 1)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={() => onChange(data.bookId, "star", rating + 1)}
            />
          ))}
        </div>
      </div>
      <Textarea
        placeholder="Hay chia se nhung gi ban thich ve san pham."
        value={data.description}
        onChange={(e) => onChange(data.bookId, "description", e.target.value)}
      />
    </div>
  );
}
