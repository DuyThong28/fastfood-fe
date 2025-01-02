import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "@/types/category";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import categoryService from "@/services/category.service";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import debounce from "lodash.debounce";

interface ComboboxProps {
  onChange: (value: string) => void;
  initCategory?: Category | null;
}

export function Combobox({ onChange, initCategory }: ComboboxProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [textSearch, setTextSearch] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const getAllCategories = useCallback(
    debounce(
      async (value: string) => {
        try {
          const response = await categoryService.searchCategory(false, value);
          setCategories(response.data.data);
        } catch (err) {
          console.log(err);
        }
      },
      500,
      {
        leading: true,
        trailing: true,
      },
    ),
    [],
  );

  useEffect(() => {
    if (initCategory) {
      setSelectedCategory(initCategory);
    }
  }, [initCategory]);

  useEffect(() => {
    if (open) {
      getAllCategories(textSearch);
    } else {
      setCategories([]);
      setTextSearch("");
    }
  }, [open]);

  useEffect(() => {
    if (selectedCategory === null) {
      onChange("");
    } else {
      onChange(selectedCategory.id);
    }
  }, [selectedCategory]);

  const handleOnChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setTextSearch(e.target.value);
    getAllCategories(e.target.value);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="w-full">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between font-medium"
        >
          {selectedCategory ? selectedCategory.name : "Chọn một danh mục..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <div
            className="flex items-center border-b px-3"
            cmdk-input-wrapper=""
          >
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Chọn một danh mục..."
              value={textSearch}
              onChange={handleOnChangeInput}
            />
          </div>
          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.id}
                  onSelect={(currentValue) => {
                    console.log(currentValue);
                    setSelectedCategory(
                      selectedCategory && selectedCategory.id === currentValue
                        ? null
                        : category,
                    );
                    setOpen(false);
                  }}
                >
                  {category.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCategory && selectedCategory.id === category.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
