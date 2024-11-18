import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ReviewTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">Mã đơn hàng</TableHead>
        <TableHead className="w-[300px]">Sản phẩm</TableHead>
        <TableHead className="w-[100px]">Đánh giá</TableHead>
        <TableHead className="w-[300px]">Nội dung</TableHead>
        <TableHead className="w-[150px]">Người đánh giá</TableHead>
        <TableHead className="w-[100px]">Ngày</TableHead>
        <TableHead className="w-[300px]">Nhà bán trả lời</TableHead>
        <TableHead className="w-[130px]  sticky right-[97px] bg-gray-50 z-10">
          Trạng thái
        </TableHead>
        <TableHead className="w-[100px]  sticky right-0 bg-gray-50 z-10">
          Thao tác
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
