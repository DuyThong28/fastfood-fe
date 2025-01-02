import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import InputOTPPattern from "@/app/routes/auth/input-otp-pattern";
import { PasswordInput } from "./password-input";
import { FormEvent, useState } from "react";
import { routes } from "@/config";
import authService from "@/services/auth.service";
import { removeAccessToken } from "@/lib/api-client";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/common/enums";
import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { toastSuccess } from "@/utils/toast";

type ErrorState = {
  password?: string;
  code?: string;
};

export default function AccountPassword() {
  const [auth, setAuth] = useAuth();
  const [user, setUser] = useUser();

  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors: ErrorState = {};

    if (!code.trim()) {
      newErrors.code = "OTP không được để trống";
    } else if (code.trim().length !== 6) {
      newErrors.code = "OTP gồm 6 ký tự";
    }

    if (!newPassword.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (newPassword.trim().length < 8) {
      newErrors.password = "Mật khẩu phải tối thiểu 8 ký tự";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const resetPassword = async () => {
    if (user)
      try {
        await authService.resetPassword({
          email: user?.email,
          newPassword: newPassword,
          code: code,
        });
        await authService.logOut();
        toastSuccess("Thay đổi mật khẩu thành công");
        setAuth(null);
        removeAccessToken();
        navigate(routes.AUTH.SIGN_IN);
      } catch (err) {
        console.log(err);
      }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;
    await resetPassword();
  };

  const handleCancel = () => {
    if (!auth) return;
    if (auth.role === UserRole.ADMIN) {
      navigate(routes.ADMIN.ACCOUNT_PROFILE);
    } else if (auth.role === UserRole.CUSTOMER) {
      navigate(routes.CUSTOMER.ACCOUNT_PROFILE);
    }
  };

  return (
    <form
      className="justify-center items-center flex h-full"
      onSubmit={handleSubmit}
      noValidate
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#A93F15]">
            Đổi Mật Khẩu
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp" className="text-[#A93F15]">
              OTP
            </Label>
            <div className="mx-auto">
              <InputOTPPattern value={code} onChange={setCode} />
            </div>
            {errors?.code && (
              <p className="text-red-500 text-xs">{errors.code}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-[#A93F15]">
              Mật khẩu
            </Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Mật khẩu"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors?.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button
            className="text-[#A93F15] hover:text-[#A93F15]"
            variant="outline"
            type="button"
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button type="submit" className="bg-[#A93F15] hover:bg-[#FF7E00]">
            Tiếp tục
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
