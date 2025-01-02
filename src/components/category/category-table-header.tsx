import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CategoryTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        {/* <TableHead className="w-[30px]">
          <Checkbox />
        </TableHead> */}
        <TableHead>Mã danh mục</TableHead>
        <TableHead>Tên danh mục</TableHead>
        <TableHead>Trạng thái</TableHead>
        <TableHead className="w-[30px]">
          <span className="sr-only">Thao tác</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
