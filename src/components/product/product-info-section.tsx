import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import image from "@/assets/placeholder.svg";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CreateBookDetail, UpdateBookDetail } from "@/types/book";
import { Combobox } from "./combo-box";

export const ProductInfoSection = ({
  onChange,
  detailData,
}: {
  onChange:
    | Dispatch<SetStateAction<CreateBookDetail>>
    | Dispatch<SetStateAction<UpdateBookDetail>>;
  detailData: CreateBookDetail | UpdateBookDetail;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const isUpdate = "id" in detailData;

  const handleUploadFile = () => {
    inputRef.current?.click();
  };

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      (onChange as Dispatch<SetStateAction<CreateBookDetail | UpdateBookDetail>>)((prevData) => {
        const newImages = prevData.images.concat(fileArray);
        if (newImages.length > 5) {
          console.log("You can only upload a maximum of 5 files.");
          return { ...prevData, images: newImages.slice(0, 5) };
        }

        return { ...prevData, images: newImages };
      });
    }
  };

  const handleChangeInput = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    (onChange as Dispatch<SetStateAction<CreateBookDetail | UpdateBookDetail>>)(
      (prevDetailData) => {
        return {
          ...prevDetailData,
          [name]: value,
        };
      },
    );
  };

  useEffect(() => {
    const imageUrls = detailData.images.map((file: File) =>
      URL.createObjectURL(file),
    );
    setSelectedImages(imageUrls);
    return () => {
      selectedImages.map((item) => URL.revokeObjectURL(item));
    };
  }, [detailData.images]);

  const handleDeleteImageFile = (index: number) => {
    console.log(index);
    (onChange as Dispatch<SetStateAction<CreateBookDetail | UpdateBookDetail>>)(
      (prevData) => {
        const newImages = prevData.images.filter(
          (_: File, i: number) => i !== index,
        );
        return { ...prevData, images: newImages };
      },
    );
  };

  const handleDeleteInitImage = (index: number) => {
    (onChange as Dispatch<SetStateAction<UpdateBookDetail>>)(
      (prevData) => {
        const newImages = prevData.image_url.filter(
          (_: string, i: number) => i !== index,
        );
        return { ...prevData, image_url: newImages };
      },
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thong Tin Chi Tiet</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-[120px_1fr]  gap-4">
          <Label className="text-right">Ten san pham</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ten san pham"
            required
            value={detailData.title}
            onChange={(e) =>
              handleChangeInput({ name: "title", value: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-[120px_1fr_1fr] gap-4">
          <Label className="text-right">Hinh anh san pham</Label>
          <div className="flex flex-row gap-4">
            
          {isUpdate && (detailData as UpdateBookDetail).image_url.map((item, index) => {
              return (
                <div
                  className="rounded-md h-[70px] w-[70px] overflow-hidden relative"
                  key={index}
                >
                  <img
                    alt="Product image"
                    className="object-cover h-full w-full absolute"
                    src={item || image}
                  />
                  <div className="bg-black w-full h-full flex items-center justify-center bg-opacity-40 z-10 absolute opacity-0 hover:opacity-100 transition-all duration-300">
                    <Trash2
                      className="w-5 h-5 text-white"
                      onClick={() => handleDeleteInitImage(index)}
                    />
                  </div>
                </div>
              );
            })}
            {selectedImages.map((item, index) => {
              return (
                <div
                  className="rounded-md h-[70px] w-[70px] overflow-hidden relative"
                  key={index}
                >
                  <img
                    alt="Product image"
                    className="object-cover h-full w-full absolute"
                    src={item || image}
                  />
                  <div className="bg-black w-full h-full flex items-center justify-center bg-opacity-40 z-10 absolute opacity-0 hover:opacity-100 transition-all duration-300">
                    <Trash2
                      className="w-5 h-5 text-white"
                      onClick={() => handleDeleteImageFile(index)}
                    />
                  </div>
                </div>
              );
            })}
            {(isUpdate ? detailData.images.length +(detailData as UpdateBookDetail).image_url.length < 5 :  detailData.images.length  < 5) && (
              <button
                className="flex aspect-square h-[70px] w-[70px] items-center justify-center rounded-md border border-dashed hover:bg-muted"
                onClick={handleUploadFile}
                type="button"
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleFilesChange}
                  style={{ display: "none" }}
                  multiple
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr]  gap-4">
          <Label className="text-right">Danh muc</Label>
          <Combobox
            onChange={(value) =>
              handleChangeInput({ name: "categoryId", value: value })
            }
            initCategory={isUpdate ? detailData.initCategory : null}
          />
        </div>
        <div className="grid grid-cols-[120px_1fr]  gap-4">
          <Label className="text-right">Mo ta san pham</Label>
          <Textarea
            placeholder="Mo ta san pham"
            required
            name="description"
            rows={4}
            value={detailData.description}
            onChange={(e) =>
              handleChangeInput({ name: "description", value: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid grid-cols-[120px_1fr]  gap-4">
            <Label className="text-right">Gia dau vao</Label>
            <Input
              id="entryPrice"
              name="entryPrice"
              type="number"
              min={0}
              required
              value={detailData.entryPrice}
              onChange={(e) =>
                handleChangeInput({ name: "entryPrice", value: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-[120px_1fr]  gap-4 ">
            <Label className="text-right">Gia ban</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              required
              value={detailData.price}
              onChange={(e) =>
                handleChangeInput({ name: "price", value: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-[120px_1fr]  gap-4">
            <Label className="text-right">Ton kho</Label>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min={0}
              required
              value={detailData.stockQuantity}
              onChange={(e) =>
                handleChangeInput({
                  name: "stockQuantity",
                  value: e.target.value,
                })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
