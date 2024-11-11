import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import image from "@/assets/placeholder.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CreateBookDetail, UpdateBookDetail } from "@/types/book";
import { dateToString } from "@/utils/format";
import { Select,SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "../ui/select";
import { Gender } from "@/common/enums";

export const EmployeeInfoSection = ({
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
        <CardTitle>Thông Tin Nhân viên</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-[120px_1fr]  gap-4">
          <Label>Tên nhân viên</Label>
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
          <Label>Hình ảnh nhân viên</Label>
          <div className="flex flex-row gap-4">
            
          {isUpdate && (detailData as UpdateBookDetail).image_url.map((item, index) => {
              return (
                <div
                  className="rounded-md h-[70px] w-[70px] overflow-hidden relative"
                  key={index}
                >
                  <img
                    alt="Employee image"
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
        <div className="grid grid-cols-[1fr_1fr] gap-4">
            <div className="space-y-2">
              <Label>Giới tính</Label>
              <Select
                // defaultValue={Gender.MALE}
                // value={accountData?.gender}
                onValueChange={(e) =>
                  handleChangeInput({
                    name: "gender",
                    value: e,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Gioi tinh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Gender.MALE}>Nam</SelectItem>
                    <SelectItem value={Gender.FEMALE}>Nữ</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Số diện thoại</Label>
              <Input
                id="phone"
                type="number"
                // value={accountData.phone}
                onChange={(e) =>
                  handleChangeInput({
                    name: "phone",
                    value: e.target.value,
                  })
                }
              />
            </div>
          <div className="space-y-2">
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                required
                // value={accountData?.email}
                onChange={(e) =>
                  handleChangeInput({
                    name: "email",
                    value: e.target.value,
                  })
                }
              />
                  </div>
                  <div className="space-y-2">
              <Label className="text-right">Ngày sinh</Label>
              <Input
                id="birthday"
                type="date"
                required
                value={dateToString(
                //   (accountData?.birthday && new Date(accountData?.birthday)) ||
                    new Date(),
                )}
                onChange={(e) =>
                  handleChangeInput({
                    name: "birthday",
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
