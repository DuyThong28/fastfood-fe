import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import image from "@/assets/placeholder.svg";
import { ResCartItem } from "@/types/cart";
import cartService from "@/services/cart.service";
import { CartCounterInput } from "./cart-counter-input";

interface CartTableRowProps {
  data: ResCartItem;
  onRefetch: () => Promise<void>;
  onCheck: (id: string) => void;
  rowSelection: string[];
}

export const CartTableRow: React.FC<CartTableRowProps> = ({
  data,
  onRefetch,
  onCheck,
  rowSelection,
}) => {
  const handleRemove = async () => {
    try {
      await cartService.removeFromCart(data.product_id);
      await onRefetch();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateCartItemQuantity = async (value: number) => {
    try {
      if (value > 0)
        await cartService.updateCartItemQuantity({
          productId: data.product_id,
          quantity: value,
        });
      else await cartService.removeFromCart(data.product_id);
      await onRefetch();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <TableRow className="bg-white shadow-sm">
      <TableCell>
        <Checkbox
          checked={rowSelection.includes(data.product_id)}
          onCheckedChange={() => {
            onCheck(data.product_id);
          }}
        />
      </TableCell>
      <TableCell className="flex flex-row gap-4">
        <img
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={data.product.image_url.length > 0 ? data.product.image_url[0] : image}
          width="64"
        />
        <div className="w-full flex flex-col justify-center">
          <div className="font-medium">{data.product.title}</div>
        </div>
      </TableCell>
      <TableCell>{data.product.price}</TableCell>
      <TableCell>
        <CartCounterInput
          max={data.product.stock_quantity}
          value={data.quantity}
          onChange={handleUpdateCartItemQuantity}
        />
      </TableCell>
      <TableCell>{data.quantity * data.product.price}</TableCell>
      <TableCell>
        <Button variant="outline" onClick={handleRemove}>
          Xoa
        </Button>
      </TableCell>
    </TableRow>
  );
};
