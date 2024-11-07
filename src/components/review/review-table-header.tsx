import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ReviewTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Mã đơn hàng</TableHead>
        <TableHead>Sản phẩm</TableHead>
        <TableHead>Đánh giá</TableHead>
        <TableHead>Nội dung</TableHead>
        <TableHead>Người đánh giá</TableHead>
        <TableHead>Ngày đánh giá</TableHead>
        <TableHead>Nhà bán trả lời</TableHead>
        <TableHead>Trạng thái</TableHead>
        <TableHead>
          <span className="sr-only">Thao tac</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
