import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CartTableHeaderProps {
  onCheck: (checked: boolean) => void;
  isCheck: boolean;
}

export const CartTableHeader: React.FC<CartTableHeaderProps> = ({
  onCheck,
  isCheck,
}) => {
  return (
    <TableHeader className="bg-white shadow-sm">
      <TableRow>
        <TableHead className="w-[30px]">
          <Checkbox checked={isCheck} onCheckedChange={onCheck} />
        </TableHead>
        <TableHead>Sản phẩm</TableHead>
        <TableHead>Đơn giá</TableHead>
        <TableHead>Số lượng</TableHead>
        <TableHead>Số tiền</TableHead>
        <TableHead className="w-[30px]">
          <span className="sr-only">Thao tác</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
