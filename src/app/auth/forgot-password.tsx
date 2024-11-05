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
import { routes } from "@/config";
import authService from "@/services/auth.service";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordRoute() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      navigate(`${routes.AUTH.RESET_PASSWORD}?email=${input}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await forgotPassword(input);
  };

  const handleCancel = () => {
    navigate(routes.AUTH.SIGN_IN);
  };

  return (
    <form
      className="justify-center items-center flex h-screen"
      onSubmit={handleSubmit}
    >
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Nhap Email Cua Ban</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={input}
              onChange={handleChangeInput}
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
