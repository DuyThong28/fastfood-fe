import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import categoryService from "@/services/category.service";
import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Category } from "@/types/category";

export interface CategoryDialogRef {
  onOpen: (id?: string) => Promise<void>;
  onClose: () => void;
}

interface CategoryDialogProps {
  onRefetch: () => Promise<void>;
}

const CategoryDialog = forwardRef<CategoryDialogRef, CategoryDialogProps>(
  function CategoryDialog({ onRefetch }, ref) {
    const [input, setInput] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [category, setCategory] = useState<Category>({
      id: "",
      name: "",
      is_disable: false,
    });

    useImperativeHandle(ref, () => {
      return {
        async onOpen(id?: string) {
          if (id) {
            try {
              const response = await categoryService.getCategoryById(id);
              setCategory(response.data.data);
              setInput(response.data.data.name);
              setIsOpen(true);
            } catch (err) {
              console.log(err);
            }
          } else {
            setIsOpen(true);
          }
        },
        onClose() {
          setIsOpen(false);
        },
      };
    }, []);

    useEffect(() => {
      if (!isOpen) {
        setInput("");
      }
    }, [isOpen]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (category.id) {
        try {
          await categoryService.upDateCategory({
            id: category.id,
            name: input,
          });
          await onRefetch();
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          await categoryService.createCategory({ name: input });
          await onRefetch();
        } catch (err) {
          console.log(err);
        }
      }
      setIsOpen(false);
      setCategory({
        id: "",
        name: "",
        is_disable: false,
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {category.id ? "Chinh sua danh muc" : "Them danh muc moi"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Label htmlFor="name">Ten danh muc</Label>
              <Input
                id="name"
                placeholder="Ten danh muc"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Huy
              </Button>
              <Button type="submit">Luu</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  },
);

export default CategoryDialog;
