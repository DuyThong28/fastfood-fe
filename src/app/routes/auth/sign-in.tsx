import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import { JWTDecode } from "@/context/auth";
import { UserRole } from "@/common/enums";
import useAuth from "@/hooks/useAuth";
import { setAccessToken } from "@/lib/api-client";
import { PasswordInput } from "@/components/shared/password-input";
import { AxiosError } from "axios";
import { toastSuccess } from "@/utils/toast";
import { routes } from "@/config";
import Background from "../../../assets/background.png";

const URL_SERVER = import.meta.env.VITE_URL_SERVER;

type ErrorState = {
  email?: string;
  password?: string;
  general?: string;
};

export default function SignInRoute() {
  const [auth, setAuth] = useAuth();
  const [input, setinput] = useState({ email_phone: "", password: "" });
  const [errors, setErrors] = useState<ErrorState>({});

  const navigate = useNavigate();

  const handleChangeInput = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    setinput((currentInfo) => {
      const newInfo = {
        ...currentInfo,
        [name]: value,
      };
      return newInfo;
    });
  };

  const validateInputs = () => {
    const newErrors: ErrorState = {};

    if (!input.email_phone.trim()) {
      newErrors.email = "Email không được để trống";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(input.email_phone)) {
        newErrors.email = "Email chưa đúng định dạng";
      }
    }

    if (!input.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (input.password.trim().length < 8) {
      newErrors.password = "Mật khẩu phải tối thiểu 8 ký tự";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateInputs()) return;
    try {
      const response = await authService.signInWithEmail(input);
      if (response.data) {
        const accessToken: string = response.data.access_token;
        setAccessToken(accessToken);
        setinput({ email_phone: "", password: "" });
        const { id, role }: JWTDecode = jwtDecode(accessToken);

        setAuth({
          userId: id,
          role,
        });
        console.log("role", role, id);
        localStorage.setItem("role", role);
        toastSuccess("Đăng nhập thành công");
        if (role === UserRole.ADMIN || role === UserRole.STAFF) {
          navigate("/dashboad");
        } else if (role === UserRole.CUSTOMER) {
          navigate("/");
        }
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 400) {
        setErrors({
          general: "Email hoặc mật khẩu chưa đúng",
        });
      }
      console.log(err);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      const googleAuthUrl = `${URL_SERVER}/auth/google`;
      window.location.href = googleAuthUrl;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full grid grid-cols-2 h-screen">
      <img src={Background} />
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-[#A93F15]">Đăng Nhập</h1>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-2">
              <Label htmlFor="phone-email" className="text-[#A93F15]">
                Email{" "}
              </Label>
              <Input
                id="phone-email"
                type="text"
                name="phone-email"
                placeholder="Email "
                value={input.email_phone}
                onChange={(e) =>
                  handleChangeInput({
                    name: "email_phone",
                    value: e.target.value,
                  })
                }
              />
              {errors?.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
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
                value={input.password}
                onChange={(e) =>
                  handleChangeInput({ name: "password", value: e.target.value })
                }
              />
              {errors?.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
              {errors?.general && (
                <p className="text-red-500 text-xs">{errors.general}</p>
              )}
            </div>
            <Link
              to={routes.AUTH.FORGOT_PASSWORD}
              className="ml-auto inline-block text-sm underline text-[#A93F15] font-medium"
            >
              Quên mật khẩu?
            </Link>
            <Button
              className="w-full bg-[#A93F15] hover:bg-[#FF7E00]"
              type="submit"
            >
              Đăng nhập
            </Button>
            <Button
              variant="outline"
              type="button"
              className="w-full text-[#A93F15] hover:text-[#A93F15]"
              onClick={handleSignInWithGoogle}
            >
              Đăng nhập với Google
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to={routes.AUTH.SIGN_UP}
              className="underline text-[#A93F15] font-medium"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
