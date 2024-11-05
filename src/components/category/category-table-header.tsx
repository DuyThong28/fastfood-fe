import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CategoryTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        {/* <TableHead className="w-[30px]">
          <Checkbox />
        </TableHead> */}
        <TableHead>Ma danh muc</TableHead>
        <TableHead>Ten danh muc</TableHead>
        <TableHead>Trang thai</TableHead>
        <TableHead className="w-[30px]">
          <span className="sr-only">Thao tac</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
