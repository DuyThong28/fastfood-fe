import image from "@/assets/placeholder.svg";
import { ResProductDetail } from "@/types/product";
import { formatNumber } from "@/utils/format";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/20/solid";
import { FiveStars } from "../shared/five-stars";

interface ProductItemCardProps {
  data: ResProductDetail;
}

export default function ProductItemCard({ data }: ProductItemCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="h-fit rounded-xl p-3 space-y-2 bg-white shadow-sm hover:shadow-lg hover:-translate-y-[2px]"
      onClick={() => navigate(`/product/${data.id}`)}
    >
      <div className="aspect-square rounded-lg overflow-hidden ">
        <img
          className="h-full w-full object-cover"
          src={(data.image_url.length > 0 && data.image_url[0]) || image}
        />
      </div>
      <div className="flex flex-col justify-between h-[auto]">
        <p className="overflow-hidden text-ellipsis line-clamp-2 font-semibold text-lg">
          {data.title}
        </p>
        <p className="font-semibold text-lg text-[#FF4E59]">{`${formatNumber(data.price)} đ`}</p>
        <div className="flex flex-row justify-between">
          <span className="flex flex-row">
            <FiveStars value={data.avg_stars} />
          </span>
        </div>
      </div>
    </div>
  );
}
