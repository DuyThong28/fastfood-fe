import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputOTPPattern from "@/app/routes/auth/Input-otp-pattern";
import { PasswordInput } from "./password-input";
import { FormEvent, useEffect, useState } from "react";
import { routes } from "@/config";
import authService from "@/services/auth.service";
import { removeAccessToken } from "@/lib/api-client";
import customerService from "@/services/customer.service";
import { useNavigate } from "react-router-dom";
import { Gender, UserRole } from "@/common/enums";
import { ResUser } from "@/types/user";
import useAuth from "@/hooks/useAuth";

export default function AccountPassword() {
  const [auth, setAuth] = useAuth();
  const [accountData, setAccountData] = useState<ResUser>({
    email: "",
    gender: Gender.MALE,
    birthday: new Date(),
    full_name: "",
    phone: undefined,
    avatar_url: undefined,
  });

  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const getAccountData = async (id: string) => {
    try {
      const response = await customerService.getAccountById(id);
      console.log(response);
      setAccountData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const resetPassword = async () => {
    try {
      await authService.resetPassword({
        email: accountData.email,
        newPassword: newPassword,
        code: code,
      });
      await authService.logOut();
      setAuth(null);
      removeAccessToken();
      navigate(routes.AUTH.SIGN_IN);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetPassword();
  };

  const handleCancel = () => {
    if (auth?.role && auth.role === UserRole.ADMIN)
      navigate(routes.ADMIN.ACCOUNT_PROFILE);
    else if (auth?.role && auth.role === UserRole.CUSTOMER)
      navigate(routes.CUSTOMER.ACCOUNT_PROFILE);
  };

  useEffect(() => {
    if (auth?.userId) {
      getAccountData(auth.userId);
    }
  }, [auth]);

  return (
    <form
      className="justify-center items-center flex h-screen"
      onSubmit={handleSubmit}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Thiet Lap Mat Khau Moi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp">OTP</Label>
            <div className="mx-auto">
              <InputOTPPattern value={code} onChange={setCode} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            {/* <Input
        id="password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      /> */}
            <PasswordInput
              id="password"
              name="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Huy
          </Button>
          <Button type="submit">Tiep Tuc</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
