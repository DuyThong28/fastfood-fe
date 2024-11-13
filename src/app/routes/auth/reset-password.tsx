import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService from "@/services/auth.service";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/config";
import InputOTPPattern from "./Input-otp-pattern";

export default function ResetPasswordRoute() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get("email") || "";
  const codeParam = queryParams.get("code");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState(codeParam || "");
  const navigate = useNavigate();

  const resetPassword = async () => {
    try {
      await authService.resetPassword({
        email: emailParam,
        newPassword: newPassword,
        code: code,
      });
      navigate(routes.AUTH.SIGN_IN);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await resetPassword();
  };

  const handleCancel = ()=>{
    navigate(routes.AUTH.FORGOT_PASSWORD);
  }

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
          {!codeParam && (
            <div className="grid gap-2">
              <Label htmlFor="otp">OTP</Label>
              <div className="mx-auto">
                <InputOTPPattern value={code} onChange={setCode} />
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
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
