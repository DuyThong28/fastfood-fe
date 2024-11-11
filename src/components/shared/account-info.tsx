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

export default function AccountInfo() {
  const [accountData, setAccountData] = useState<ResUser>({
    email: "",
    gender: Gender.MALE,
    birthday: new Date(),
    full_name: "",
    phone: undefined,
    avatar_url: undefined,
  });
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

  const handleChangePass = async () => {
    if (auth) {
      try {
        await authService.forgotPassword(accountData.email);
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
    try {
      const response = await customerService.updateAccount(
        accountData,
        imageFile
      );
      setUser({
        avatar_url: response.data.data.avatar_url,
        full_name: response.data.data.full_name,
      });
    } catch (err) {
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
        <form className="flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
          <div className="relative mx-auto">
            <img
              className="w-28 h-28 rounded-full border-4 border-[#C2E1FF]"
              src={accountData.avatar_url || image}
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
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Ho va ten</Label>
              <Input
                id="fullName"
                type="fullName"
                required
                value={accountData?.full_name}
                onChange={(e) =>
                  handleChangeInput({
                    name: "full_name",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Ngay sinh</Label>
              <Input
                id="birthday"
                type="date"
                required
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
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Gioi tinh</Label>
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
                    <SelectItem value={Gender.FEMALE}>Nu</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>So dien thoai</Label>
              <Input
                id="phone"
                type="number"
                value={accountData.phone}
                onChange={(e) =>
                  handleChangeInput({
                    name: "phone",
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={accountData?.email}
                onChange={(e) =>
                  handleChangeInput({
                    name: "email",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Password</Label>
              <Button
                variant="secondary"
                type="button"
                onClick={handleChangePass}
              >
                Doi mat khau
              </Button>
            </div>
          </div>
          <div className="flex flex-row gap-6 mx-auto">
            <Button
              className="w-40"
              variant="outline"
              type="button"
              onClick={handleCancel}
            >
              Huy
            </Button>
            <Button className="w-40" type="submit">
              Xac nhan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
