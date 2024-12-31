import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import image from "@/assets/placeholder.svg";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CreateProductDetail, UpdateProductDetail } from "@/types/product";
import { Combobox } from "./combo-box";
import { AddProductErrorState } from "@/app/routes/admin/add-product";

export const ProductInfoSection = ({
  onChange,
  detailData,
  errors,
}: {
  onChange:
    | Dispatch<SetStateAction<CreateProductDetail>>
    | Dispatch<SetStateAction<UpdateProductDetail>>;
  detailData: CreateProductDetail | UpdateProductDetail;
  errors: AddProductErrorState;
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
      (
        onChange as Dispatch<
          SetStateAction<CreateProductDetail | UpdateProductDetail>
        >
      )((prevData) => {
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
    (
      onChange as Dispatch<
        SetStateAction<CreateProductDetail | UpdateProductDetail>
      >
    )((prevDetailData) => {
      return {
        ...prevDetailData,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const imageUrls = detailData.images.map((file: File) =>
      URL.createObjectURL(file)
    );
    setSelectedImages(imageUrls);
    return () => {
      selectedImages.map((item) => URL.revokeObjectURL(item));
    };
  }, [detailData.images]);

  const handleDeleteImageFile = (index: number) => {
    console.log(index);
    (
      onChange as Dispatch<
        SetStateAction<CreateProductDetail | UpdateProductDetail>
      >
    )((prevData) => {
      const newImages = prevData.images.filter(
        (_: File, i: number) => i !== index
      );
      return { ...prevData, images: newImages };
    });
  };

  const handleDeleteInitImage = (index: number) => {
    (onChange as Dispatch<SetStateAction<UpdateProductDetail>>)((prevData) => {
      const newImages = prevData.image_url.filter(
        (_: string, i: number) => i !== index
      );
      return { ...prevData, image_url: newImages };
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-[#A93F15] text-lg font-semibold">
          Thông Tin Chi Tiết
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 ">
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <Label className="text-right text-[#A93F15]">Tên sản phẩm</Label>
          <div>
            <Input
              id="title"
              name="title"
              placeholder="Tên sản phẩm"
              value={detailData.title}
              onChange={(e) =>
                handleChangeInput({ name: "title", value: e.target.value })
              }
            />
            {errors?.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr_1fr] gap-4">
          <Label className="text-right text-[#A93F15]">Hình ảnh sản phẩm</Label>
          <div>
            <div className="flex flex-row gap-4">
              {isUpdate &&
                (detailData as UpdateProductDetail).image_url.map(
                  (item, index) => {
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
                  }
                )}
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
              {(isUpdate
                ? detailData.images.length +
                    (detailData as UpdateProductDetail).image_url.length <
                  5
                : detailData.images.length < 5) && (
                <button
                  className="flex flex-col aspect-square h-[70px] w-[70px] items-center justify-center rounded-md border border-dashed hover:bg-muted"
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
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs">
                    {`Thêm hình ảnh (${
                      isUpdate
                        ? detailData.images.length +
                          (detailData as UpdateProductDetail).image_url.length
                        : detailData.images.length
                    }/5)`}
                  </span>
                </button>
              )}
            </div>
            {errors?.images && (
              <p className="text-red-500 text-xs">{errors.images}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr]  gap-4">
          <Label className="text-right text-[#A93F15]">Danh mục</Label>
          <div>
            <Combobox
              onChange={(value) =>
                handleChangeInput({ name: "categoryId", value: value })
              }
              initCategory={isUpdate ? detailData.initCategory : null}
            />
            {errors?.categoryId && (
              <p className="text-red-500 text-xs">{errors.categoryId}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr]  gap-4">
          <Label className="text-right text-[#A93F15]">Mô tả sản phẩm</Label>
          <div>
            <Textarea
              placeholder="Mô tả sản phẩm"
              name="description"
              rows={4}
              value={detailData.description}
              onChange={(e) =>
                handleChangeInput({
                  name: "description",
                  value: e.target.value,
                })
              }
            />
            {errors?.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid grid-cols-[120px_1fr]  gap-4">
            <Label className="text-right text-[#A93F15]">Giá đầu vào</Label>
            <div>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                min={0}
                value={detailData.entryPrice}
                onChange={(e) =>
                  handleChangeInput({
                    name: "entryPrice",
                    value: e.target.value,
                  })
                }
              />
              {errors?.entryPrice && (
                <p className="text-red-500 text-xs">{errors.entryPrice}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-[120px_1fr]  gap-4 ">
            <Label className="text-right text-[#A93F15]">Giá bán</Label>
            <div>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                value={detailData.price}
                onChange={(e) =>
                  handleChangeInput({ name: "price", value: e.target.value })
                }
              />
              {errors?.price && (
                <p className="text-red-500 text-xs">{errors.price}</p>
              )}
            </div>
          </div>
          {/* <div className="grid grid-cols-[120px_1fr]  gap-4">
            <Label className="text-right">Tồn kho</Label>
            <div>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min={0}
                value={detailData.stockQuantity}
                onChange={(e) =>
                  handleChangeInput({
                    name: "stockQuantity",
                    value: e.target.value,
                  })
                }
              />
              {errors?.stockQuantity && (
                <p className="text-red-500 text-xs">{errors.stockQuantity}</p>
              )}
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};
