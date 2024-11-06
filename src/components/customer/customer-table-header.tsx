import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CustomerTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
      <TableHead className="w-10">Avatar</TableHead>
        <TableHead>Ho va ten</TableHead>
        <TableHead>Ngay sinh</TableHead>
        <TableHead>Gioi tinh</TableHead>
        <TableHead>so dien thoai</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Trang thai</TableHead>
        <TableHead>
          <span className="sr-only">Thao tac</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
