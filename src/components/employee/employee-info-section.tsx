import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import image from "@/assets/placeholder.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { dateToString } from "@/utils/format";
import { Select,SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "../ui/select";
import { Gender } from "@/common/enums";
import { Employee } from "@/types/user";

export const EmployeeInfoSection = ({
  onChange,
  detailData,
}: {
  onChange:
    | Dispatch<SetStateAction<Employee>>
  detailData: Employee;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
//   const isUpdate = "id" in detailData;

  const handleUploadFile = () => {
    inputRef.current?.click();
  };

//   const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       const fileArray = Array.from(files);
//       (onChange)((prevData) => {
//         const newImages = prevData.avatar_url?.concat(fileArray);
//         if (newImages.length > 1) {
//           console.log("You can only upload a maximum of 1 file.");
//           return { ...prevData, images: newImages.slice(0, 5) };
//         }

//         return { ...prevData, images: newImages };
//       });
//     }
//   };

  const handleChangeInput = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    (onChange as Dispatch<SetStateAction<Employee>>)(
      (prevDetailData) => {
        return {
          ...prevDetailData,
          [name]: value,
        };
      },
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (imageFile != null) {
      onChange((prevData) => {
        return {
          ...prevData,
          avatar_url: URL.createObjectURL(imageFile),
        };
      });
    }

    return () => {
      if (detailData.avatar_url) {
        URL.revokeObjectURL(detailData.avatar_url);
      }
    };
  }, [detailData.avatar_url, imageFile, onChange]);

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
            placeholder="Ten nhân viên"
            required
            value={detailData.full_name}
            onChange={(e) =>
              handleChangeInput({ name: "full_name", value: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-[120px_1fr_1fr] gap-4">
          <Label>Hình ảnh nhân viên</Label>
          <div className="relative">
            <img
              className="w-28 h-28 rounded-full border-4 border-[#C2E1FF]"
              src={detailData.avatar_url || image}
              alt="Rounded avatar"
            />
            <div
              className="absolute bottom-[10px] left-[90px] w-4 h-4 bg-[#64646D] rounded-full flex justify-center items-center hover:cursor-pointer"
              onClick={handleUploadFile}
            >
              <Pencil className="w-3 h-3 text-white absolute" />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="grid grid-cols-[1fr_1fr] gap-4">
            <div className="space-y-2">
              <Label>Giới tính</Label>
              <Select
                defaultValue={Gender.MALE}
                value={detailData?.gender}
                onValueChange={(e) =>
                  handleChangeInput({
                    name: "gender",
                    value: e,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Giới tính" />
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
                value={detailData.phone}
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
                value={detailData?.email}
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
                  (detailData?.birthday && new Date(detailData?.birthday)) ||
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
