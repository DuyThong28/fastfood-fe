import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import categoryService from "@/services/category.service";
import { FormEvent, forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Category } from "@/types/category";
import { toastSuccess } from "@/utils/toast";
import { AxiosError } from "axios";

export interface CategoryDialogRef {
  onOpen: (id?: string) => Promise<void>;
  onClose: () => void;
}

interface CategoryDialogProps {
  onRefetch: () => Promise<void>;
}

type ErrorState = {
  input?: string;
};

const CategoryDialog = forwardRef<CategoryDialogRef, CategoryDialogProps>(
  function CategoryDialog({ onRefetch }, ref) {
    const [input, setInput] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [category, setCategory] = useState<Category>({
      id: "",
      name: "",
      is_disable: false,
    });
    const [errors, setErrors] = useState<ErrorState>({});

    const validateInputs = () => {
      const newErrors: ErrorState = {};

      if (!input.trim()) {
        newErrors.input = "Tên danh mục không được để trống";
      }

      setErrors(newErrors);

      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => {
      return {
        async onOpen(id?: string) {
          if (id) {
            try {
              const response = await categoryService.getCategoryById(id);
              setCategory(response.data.data);
              setInput(response.data.data.name);
              setErrors({});
              setIsOpen(true);
            } catch (err) {
              console.log(err);
            }
          } else {
            setCategory({
              id: "",
              name: "",
              is_disable: false,
            });
            setInput("");
            setErrors({});
            setIsOpen(true);
          }
        },
        onClose() {
          setErrors({});
          setIsOpen(false);
        },
      };
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateInputs()) return;
      try {
        if (category.id) {
          await categoryService.upDateCategory({
            id: category.id,
            name: input,
          });
          toastSuccess("Cập nhật danh mục thành công");
        } else {
          await categoryService.createCategory({ name: input });
          toastSuccess("Tạo mới danh mục thành công");
        }
        await onRefetch();
        setIsOpen(false);
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError && err.response?.status === 400) {
          setErrors({
            input: "Danh mục đã tồn tại",
          });
        } else if (err instanceof AxiosError && err.response?.status === 500) {
          setErrors({
            input: "Danh mục đã tồn tại",
          });
        }
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[#A93F15]">
              {category.id ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-4">
              <Label htmlFor="name" className=" text-[#A93F15]">
                Tên danh mục
              </Label>
              <Input
                id="name"
                placeholder="Tên danh mục"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {errors?.input && (
                <p className="text-red-500 text-xs">{errors.input}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                className=" text-[#A93F15] hover:text-[#A93F15]"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-[#A93F15] hover:bg-[#A93F15]">
                Lưu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

export default CategoryDialog;
