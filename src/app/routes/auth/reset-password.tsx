import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import authService from "@/services/auth.service";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InputOTPPattern from "./Input-otp-pattern";
import { routes } from "@/config";
import { PasswordInput } from "@/components/shared/password-input";
import { AxiosError } from "axios";
import { toastSuccess } from "@/utils/toast";

type ErrorState = {
  password?: string;
  code?: string;
};

export default function ResetPasswordRoute() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get("email") || "";
  const codeParam = queryParams.get("code");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState(codeParam || "");
  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();

  const resetPassword = async () => {
    try {
      await authService.resetPassword({
        email: emailParam,
        newPassword: newPassword,
        code: code,
      });
      toastSuccess("Thiết lập mật khẩu mới thành công");
      navigate(routes.AUTH.SIGN_IN);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 400) {
        setErrors({
          code: "OTP chưa chính xác. Vui lòng nhập lại",
        });
      }
      console.log(err);
    }
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;
    await resetPassword();
  };

  const handleCancel = () => {
    navigate(routes.AUTH.FORGOT_PASSWORD);
  };

  return (
    <form
      className="justify-center items-center flex h-screen"
      onSubmit={handleSubmit}
      noValidate
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Thiết Lập Mật Khẩu Mới</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!codeParam && (
            <div className="grid gap-2">
              <Label htmlFor="otp">OTP</Label>
              <div className="mx-auto">
                <InputOTPPattern value={code} onChange={setCode} />
              </div>
              {errors?.code && (
                <p className="text-red-500 text-xs">{errors.code}</p>
              )}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu</Label>
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
          <Button variant="outline" type="button" onClick={handleCancel}>
            Hủy
          </Button>
          <Button type="submit">Tiếp tục</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
