import image from "@/assets/placeholder.svg";
import { OrderItem } from "@/types/order";

interface ProductOrderTableRowProps {
  data: OrderItem;
}

export default function ProductOrderTableRow({
  data,
}: ProductOrderTableRowProps) {
  return (
    <div className="flex flex-frow gap-4">
      <div className="overflow-hidden aspect-square rounded-md h-[64px]">
        <img
          alt="Product image"
          className="object-cover w-full h-full"
          src={
            (data.book.image_url.length > 0 && data.book.image_url[0]) || image
          }
        />
      </div>
      <div className="flex flex-col gap-1">
        <div>{data.book.title}</div>
        <div className="text-sm">
          <span className="text-[#787C80]">So luong: </span>
          {data.quantity}
        </div>
      </div>
    </div>
  );
}
