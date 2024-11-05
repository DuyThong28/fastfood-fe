import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/category";
import categoryService from "@/services/category.service";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CategoryState } from "@/common/enums";
import { useState } from "react";

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
  const handleHide = async () => {
    try {
      await categoryService.disableCategoryById(data.id);
      await onRefetch();
    } catch (err) {
      console.log(err);
    }
    setIsOpen(false);
  };

  const handleShow = async () => {
    try {
      const response =await categoryService.enableCategoryById(data.id);
      console.log("thisi s", response)
      await onRefetch();
    } catch (err) {
      console.log(err);
    }
    setIsOpen(false);
  };

  return (
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
              Chinh sua
            </div>
            {data.is_disable ? (
              <div
                className="py-2 px-3  w-full hover:bg-[#F4F4F5]"
                onClick={handleShow}
              >
                Hien thi
              </div>
            ) : (
              <div
                className="py-2 px-3  w-full hover:bg-[#F4F4F5]"
                onClick={handleHide}
              >
                An
              </div>
            )}
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
};
