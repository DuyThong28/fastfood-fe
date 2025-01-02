import image from "@/assets/placeholder.svg";
import { ResProductDetail } from "@/types/product";
import { formatNumber } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/20/solid";

interface ProductItemCardProps {
  data: ResProductDetail;
}

export default function ProductItemCard({ data }: ProductItemCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="h-fit p-2 space-y-2 bg-white shadow-sm hover:shadow-md hover:-translate-y-[2px]"
      onClick={() => navigate(`/product/${data.id}`)}
    >
      <div className="aspect-square rounded-md overflow-hidden ">
        <img
          className="h-full w-full object-cover"
          src={(data.image_url.length > 0 && data.image_url[0]) || image}
        />
      </div>
      <div className="flex flex-col justify-between h-[60px]">
        <p className="overflow-hidden text-ellipsis line-clamp-2 font-bold">
          {data.title}
        </p>
        <p className="text-gray-500 ">{`${formatNumber(data.price)} đ`}</p>
        <div className="flex flex-row justify-between">
          <span className="flex flex-row">
            <StarIcon className="text-[#A93F15]  h-4 w-4 flex-shrink-0" />
            {data.avg_stars}
          </span>
        </div>
      </div>
    </div>
  );
}
