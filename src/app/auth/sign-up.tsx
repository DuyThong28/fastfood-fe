import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/auth.service";
import { User } from "@/types/user";
import { dateToString, stringToDate } from "@/utils/format";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gender } from "@/common/enums";

export default function SignUpRoute() {
  const [input, setinput] = useState<User>({
    email: "",
    password: "",
    fullName: "",
    gender: Gender.MALE,
    birthday: new Date(),
  });
  const navigate = useNavigate();

  function handleChangeInput({ name, value }: { name: string; value: string }) {
    if (name === "birthday") {
      setinput((currentInfo) => {
        const newInfo = {
          ...currentInfo,
          [name]: stringToDate(value),
        };
        return newInfo;
      });
    } else {
      setinput((currentInfo) => {
        const newInfo = {
          ...currentInfo,
          [name]: value,
        };
        return newInfo;
      });
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await authService.signUpByEmail(input);
      setinput({
        email: "",
        password: "",
        fullName: "",
        gender: Gender.MALE,
        birthday: new Date(),
      });
      navigate("/auth/sign-in");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full grid grid-cols-2 h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Dang Ky</h1>
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Ho va ten</Label>
              <Input
                id="name"
                type="text"
                name="name"
                required
                value={input.fullName}
                onChange={(e) =>
                  handleChangeInput({
                    name: "fullName",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="birthday">Ngay sinh</Label>
                <Input
                  id="birthday"
                  type="date"
                  name="birthday"
                  required
                  value={dateToString(input.birthday || new Date())}
                  onChange={(e) =>
                    handleChangeInput({
                      name: "birthday",
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gioi tinh</Label>
                <Select
                  value={input.gender}
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={input.email}
                onChange={(e) =>
                  handleChangeInput({ name: "email", value: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Mat khau</Label>
              <Input
                id="password"
                type="password"
                required
                value={input.password}
                onChange={(e) =>
                  handleChangeInput({ name: "password", value: e.target.value })
                }
              />
            </div>

            <Button className="w-full" type="submit">
              Tiep tuc
            </Button>
            {/* <Button variant="outline" className="w-full">
              Dang Ky voi Google
            </Button> */}
          </form>

          <div className="mt-4 text-center text-sm">
            Da co tai khoan?{" "}
            <a href="./sign-in" className="underline">
              Dang Nhap
            </a>
          </div>
        </div>
      </div>
      <div className="bg-black"></div>
    </div>
  );
}
