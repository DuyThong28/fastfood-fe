import { Card, CardContent } from "@/components/ui/card";

import { Pencil } from "lucide-react";

import image from "@/assets/placeholder.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ResUser } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Gender, UserRole } from "@/common/enums";
import useAuth from "@/hooks/useAuth";
import customerService from "@/services/customer.service";
import { dateToString, stringToDate } from "@/utils/format";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { routes } from "@/config";
import authService from "@/services/auth.service";
import useUser from "@/hooks/useUser";
import { AxiosError } from "axios";
import { toastSuccess } from "@/utils/toast";

type ErrorState = {
  email?: string;
  fullName?: string;
  gender?: string;
  birthday?: string;
  phone?: string;
};

export default function AccountInfo() {
  const [accountData, setAccountData] = useState<ResUser>({
    email: "",
    gender: Gender.MALE,
    birthday: new Date(),
    full_name: "",
    phone: undefined,
    avatar_url: undefined,
  });
  const [errors, setErrors] = useState<ErrorState>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [auth] = useAuth();
  const [user, setUser] = useUser();
  const navigate = useNavigate();
  const getAccountData = async (id: string) => {
    setImageFile(null);
    try {
      const response = await customerService.getAccountById(id);
      setAccountData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (auth?.userId) {
      getAccountData(auth.userId);
    }
  }, [auth]);

  const validateInputs = () => {
    const newErrors: ErrorState = {};

    if (!accountData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(accountData.email.trim())) {
        newErrors.email = "Email chưa đúng định dạng";
      }
    }

    if (!accountData.full_name?.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }
    const phoneRegex = /^\d{10}$/;
    if (accountData.phone && !phoneRegex.test(accountData.phone.toString())) {
      newErrors.phone = "Số điện thoại chưa đúng định dạng";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChangePass = async () => {
    if (auth) {
      try {
        await authService.forgotPassword(accountData.email);
        toastSuccess("OTP đã được gửi đến email của bạn");
        if (auth.role === UserRole.ADMIN) {
          navigate(routes.ADMIN.CHANGE_PASSWORD);
        } else if (auth.role === UserRole.CUSTOMER) {
          navigate(routes.CUSTOMER.CHANGE_PASSWORD);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;
    try {
      const response = await customerService.updateAccount(
        accountData,
        imageFile
      );
      setUser({
        avatar_url: response.data.data.avatar_url,
        full_name: response.data.data.full_name,
        email: response.data.data.email,
      });
      toastSuccess("Cập nhật tài khoản thành công");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 400) {
        setErrors({
          email: "Email đã được sử dụng. Vui lòng chọn email khác",
        });
      }
      console.log(err);
    }
  };

  function handleChangeInput({ name, value }: { name: string; value: string }) {
    if (name === "birthday") {
      setAccountData((currentInfo) => {
        const newInfo = {
          ...currentInfo,
          [name]: stringToDate(value),
        };
        return newInfo;
      });
    } else {
      setAccountData((currentInfo) => {
        const newInfo = {
          ...currentInfo,
          [name]: value,
        };
        return newInfo;
      });
    }
  }

  const handleCancel = () => {
    if (auth?.userId) {
      getAccountData(auth.userId);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  useEffect(() => {
    if (imageFile != null) {
      setAccountData((prevData) => {
        return {
          ...prevData,
          avatar_url: URL.createObjectURL(imageFile),
        };
      });
    }

    return () => {
      if (accountData.avatar_url) {
        URL.revokeObjectURL(accountData.avatar_url);
      }
    };
  }, [imageFile]);

  const handleUploadFile = () => {
    inputRef.current?.click();
  };

  return (
    <Card className="w-full">
      <CardContent>
        <form
          className="flex flex-col gap-6 mt-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="relative mx-auto">
            <img
              className="w-28 h-28 rounded-full border-4 border-[#C2E1FF]"
              src={accountData.avatar_url || image}
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
          <div className="grid grid-cols-2 gap-6 text-[#A93F15]">
            <div className="space-y-2">
              <Label className="font-semibold">Họ và tên</Label>
              <Input
                id="fullName"
                type="fullName"
                value={accountData?.full_name}
                onChange={(e) =>
                  handleChangeInput({
                    name: "full_name",
                    value: e.target.value,
                  })
                }
              />
              {errors?.fullName && (
                <p className="text-red-500 text-xs">{errors.fullName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Ngày sinh</Label>
              <Input
                id="birthday"
                type="date"
                value={dateToString(
                  (accountData?.birthday && new Date(accountData?.birthday)) ||
                    new Date()
                )}
                onChange={(e) =>
                  handleChangeInput({
                    name: "birthday",
                    value: e.target.value,
                  })
                }
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-[#A93F15]">
            <div className="space-y-2">
              <Label className="font-semibold">Giới tính</Label>
              <Select
                defaultValue={Gender.MALE}
                value={accountData?.gender}
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
              <Label className="font-semibold">Số điện thoại</Label>
              <Input
                id="phone"
                type="number"
                className="placeholder:text-[#A93F15]"
                placeholder="Số điện thoại"
                value={accountData.phone}
                onChange={(e) =>
                  handleChangeInput({
                    name: "phone",
                    value: e.target.value,
                  })
                }
              />
              {errors?.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-[#A93F15]">
            <div className="space-y-2">
              <Label className="font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={accountData?.email}
                onChange={(e) =>
                  handleChangeInput({
                    name: "email",
                    value: e.target.value,
                  })
                }
              />
              {errors?.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Mật khẩu</Label>
              <Button
                variant="secondary"
                className="bg-[#fbf9f6] text-[#A93F15]"
                type="button"
                onClick={handleChangePass}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </div>
          <div className="flex flex-row gap-6 mx-auto">
            <Button
              className="w-40 text-[#A93F15]"
              variant="outline"
              type="button"
              onClick={handleCancel}
            >
              Hủy
            </Button>
            <Button
              className="w-40 bg-[#A93F15] hover:bg-[#FF7E00]"
              type="submit"
            >
              Xác Nhận
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
