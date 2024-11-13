import image from "@/assets/placeholder.svg";
import { ResProductDetail } from "@/types/product";
import { useNavigate } from "react-router-dom";

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
        <p className="overflow-hidden text-ellipsis line-clamp-2">
          {data.title}
        </p>
        <div className="flex flex-row justify-between">
          <span>{data.stock_quantity}</span>
          <span>{`Da ban: ${data.sold_quantity}`}</span>
        </div>
      </div>
    </div>
  );
}
