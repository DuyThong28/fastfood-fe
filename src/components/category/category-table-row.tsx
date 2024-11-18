import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";
import categoryService from "@/services/category.service";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CategoryState } from "@/common/enums";
import { useRef, useState } from "react";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "../shared/alert-dialog";
import { toastSuccess } from "@/utils/toast";

interface CategoryTableRowProps {
  data: Category;
  onUpdate: (id: string) => void;
  onRefetch: () => Promise<void>;
}

export const CategoryTableRow: React.FC<CategoryTableRowProps> = ({
  data,
  onUpdate,
  onRefetch,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);
  const handleHide = async () => {
    alertDialogRef.current?.onOpen(
      {
        title: `Bạn có chắc chắn muốn ẩn danh mục này?`,
        description:
          "Sau khi ẩn, khách hàng sẽ không thể xem hoặc mua các sản phẩm trong danh mục này cho đến khi nó được kích hoạt lại.",
      },
      async () => {
        try {
          await categoryService.disableCategoryById(data.id);
          toastSuccess("Ẩn danh mục thành công");
          await onRefetch();
          setIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      }
    );
  };

  const handleShow = async () => {
    alertDialogRef.current?.onOpen(
      {
        title: `Bạn có chắc chắn muốn kích hoạt danh mục này?`,
        description:
          "Sau khi kích hoạt, danh mục sẽ xuất hiện trên hệ thống và khách hàng có thể xem và mua các sản phẩm trong danh mục này.",
      },
      async () => {
        try {
          await categoryService.enableCategoryById(data.id);
          toastSuccess("Kích hoạt danh mục thành công");
          await onRefetch();
          setIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      }
    );
  };

  return (
    <>
      <CustomAlertDialog ref={alertDialogRef} />
      <TableRow>
        {/* <TableCell>
        <Checkbox />
      </TableCell> */}
        <TableCell>{data.id}</TableCell>
        <TableCell>{data.name}</TableCell>
        <TableCell>
          <Badge variant="secondary">
            {data.is_disable ? CategoryState.HIDE : CategoryState.ACTIVE}
          </Badge>
        </TableCell>
        <TableCell>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-1">
              <div
                className="py-2 px-3 w-full hover:bg-[#F4F4F5]"
                onClick={() => {
                  onUpdate(data.id);
                  setIsOpen(false);
                }}
              >
                Chỉnh sửa
              </div>
              {data.is_disable ? (
                <div
                  className="py-2 px-3 w-full hover:bg-[#F4F4F5]"
                  onClick={handleShow}
                >
                  Hiển thị
                </div>
              ) : (
                <div
                  className="py-2 px-3 w-full hover:bg-[#F4F4F5]"
                  onClick={handleHide}
                >
                  Ẩn
                </div>
              )}
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    </>
  );
};
