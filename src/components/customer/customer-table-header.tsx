import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CustomerTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10">Avatar</TableHead>
        <TableHead>Họ và tên</TableHead>
        <TableHead>Ngày sinh</TableHead>
        <TableHead>Giới tính</TableHead>
        <TableHead>Số điện thoại</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Trạng thái</TableHead>
        <TableHead>
          <span className="sr-only">Thao tác</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
