import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortButton } from "../shared/sort-button";

interface ProductTableHeaderProps {
  onSort: (newOrder: string, newSort: string) => void;
  order: string;
  sortBy: string;
}
export const ProductTableHeader: React.FC<ProductTableHeaderProps> = ({
  onSort,
  sortBy,
  order,
}) => {
  return (
    <TableHeader>
      <TableRow className=" hover:bg-transparent">
        {/* <TableHead className="w-[30px]">
          <Checkbox />
        </TableHead> */}
        <TableHead className="w-1/2">
          <SortButton
            checked={sortBy === "title"}
            order={order}
            text="Ten san pham"
            onClick={(newOrder) => onSort(newOrder, "title")}
          />
        </TableHead>
        <TableHead>Danh muc</TableHead>
        <TableHead>Trang thai</TableHead>
        <TableHead>
          <SortButton
            checked={sortBy === "entry_price"}
            order={order}
            text="Gia nhap kho"
            onClick={(newOrder) => onSort(newOrder, "entry_price")}
          />
        </TableHead>
        <TableHead>
          <SortButton
            checked={sortBy === "price"}
            order={order}
            text="Gia ban"
            onClick={(newOrder) => onSort(newOrder, "price")}
          />
        </TableHead>
        <TableHead>
          <SortButton
            checked={sortBy === "stock_quantity"}
            order={order}
            text="Ton kho"
            onClick={(newOrder) => onSort(newOrder, "stock_quantity")}
          />
        </TableHead>
        <TableHead>
          <span className="sr-only">Thao tac</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
