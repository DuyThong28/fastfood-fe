import { CartTableHeader } from "@/components/cart/cart-table-header";
import { CartTableRow } from "@/components/cart/cart-table-row";
import ProductLayout from "@/components/layouts/product-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody } from "@/components/ui/table";
import { routes } from "@/config";
import cartService from "@/services/cart.service";
import { Meta } from "@/types/api";
import { ResCartItem } from "@/types/cart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartRoute() {
  const [cart, setCart] = useState<Array<ResCartItem>>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [rowSelection, setRowSelection] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const response = await cartService.getCart();
      setCart(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCart();
  }, [meta.page]);

  const handleSelect = (id: string) => {
    setRowSelection((prevData) => {
      if (prevData.includes(id)) {
        return prevData.filter((item) => item !== id);
      } else {
        return prevData.concat(id);
      }
    });
  };

  useEffect(() => {
    if (cart.length > 0 && cart.length === rowSelection.length) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [rowSelection, cart]);

  const handleCountTotalPrice = () =>
    cart.reduce((total, curr) => {
      if (rowSelection.includes(curr.book_id)) {
        return total + curr.book.price * curr.quantity;
      } else return total;
    }, 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setRowSelection(cart.map((item) => item.book_id));
    } else {
      setRowSelection([]);
    }
  };

//   const handlePurchase = () => {
//     if (rowSelection.length > 0) {
//       const query = rowSelection.map(String).join(",");
//       console.log(query)
//       navigate(`${routes.CUSTOMER.CHECKOUT}?state=${query}`);
//     }
//   };

  return (
    <ProductLayout>
      <main className="flex flex-1 flex-col gap-6 py-6 pl-6 relative">
        <Table className="table-auto border-separate border-spacing-y-2 w-full">
          <CartTableHeader onCheck={handleSelectAll} isCheck={isAllSelected} />
          <TableBody>
            {cart.map((item, index) => {
              return (
                <CartTableRow
                  key={index}
                  data={item}
                  onRefetch={getCart}
                  onCheck={handleSelect}
                  rowSelection={rowSelection}
                />
              );
            })}
          </TableBody>
        </Table>
        <div
          className="sticky bottom-0 left-40 right-40  h-16 flex flex-row justify-between p-4 bg-white"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 11px 5px",
          }}
        >
          <div className="flex flex-row items-center gap-4">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <div onClick={() => handleSelectAll(!isAllSelected)}>
              Chon tat ca
            </div>
            <div>Xoa</div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div>{`Tong thanh toan (${rowSelection.length} san pham): ${handleCountTotalPrice()}d`}</div>
            <Button onClick={handlePurchase}>Mua hang</Button>
          </div>
        </div>
      </main>
    </ProductLayout>
  );
}
