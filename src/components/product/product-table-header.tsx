import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProductTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/2">Ten san pham</TableHead>
        <TableHead>Danh muc</TableHead>
        <TableHead>Trang thai</TableHead>
        <TableHead>Gia nhap kho</TableHead>
        <TableHead>Gia ban</TableHead>
        <TableHead>Ton kho</TableHead>
        <TableHead>
          <span className="sr-only">Thao tac</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
