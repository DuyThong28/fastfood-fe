import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/config";
import { EmployeeInfoSection } from "@/components/employee/employee-info-section";
import { CreateEmployee, Employee, UpdateEmployee } from "@/types/user";
import { Gender } from "@/common/enums";
import userService from "@/services/user.service";
import { toastSuccess } from "@/utils/toast";

type ErrorState = {
  email?: string;
  gender?: string;
  birthday?: string;
  phone?: string;
  full_name?: string;
  password?: string;
};

interface EmployeeNavigate {
  state: {
    data: Employee;
    isUpdate: boolean;
  };
}

export default function AddEmployeeRoute() {
  const location = useLocation() as EmployeeNavigate;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detailData, setDetailData] = useState<Employee>({
    id: location.state?.data.id || "",
    email: location.state?.data.email || "",
    gender: location.state?.data.gender || Gender.MALE,
    birthday: location.state?.data.birthday || new Date(),
    phone: location.state?.data.phone || undefined,
    full_name: location.state?.data.full_name || "",
    role: "STAFF",
    password: "",
    avatar_url: location.state?.data.avatar_url || undefined,
  });
  console.log("detailData", detailData);
  const [errors, setErrors] = useState<ErrorState>({});
  const navigate = useNavigate();

  const validateInputs = (type: string) => {
    const newErrors: ErrorState = {};

    if (!detailData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(detailData.email.trim())) {
        newErrors.email = "Email chưa đúng định dạng";
      }
    }

    if (!detailData.full_name?.trim()) {
      newErrors.full_name = "Họ và tên không được để trống";
    }
    const phoneRegex = /^\d{10}$/;
    if (detailData.phone && !phoneRegex.test(detailData.phone.toString())) {
      newErrors.phone = "Số điện thoại chưa đúng định dạng";
    }
    if (type === "create" && !detailData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  console.log("Error", errors);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (location.state?.isUpdate) {
        if (!validateInputs("update")) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = detailData;
        const finalUpdateData: UpdateEmployee = {
          id: updateData.id,
          email: updateData.email,
          gender: updateData.gender,
          birthday: updateData.birthday || new Date(),
          phone: updateData.phone,
          fullName: updateData.full_name,
          role: "STAFF",
        };
        console.log("updateData", updateData);
        await userService.updateStaff(finalUpdateData, imageFile);
        toastSuccess("Cập nhật tài khoản thành công");
        navigate(routes.ADMIN.EMPLOYEE);
      } else {
        if (!validateInputs("create")) return;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = detailData;
        const finalUpdateData: CreateEmployee = {
          email: updateData.email,
          gender: updateData.gender,
          birthday: updateData.birthday || new Date(),
          phone: updateData.phone,
          fullName: updateData.full_name,
          role: "STAFF",
          password: detailData.password,
        };
        await userService.createEmployee(finalUpdateData);
        toastSuccess("Tạo tài khoản thành công");
        navigate(routes.ADMIN.EMPLOYEE);
      }
      // navigate(routes.ADMIN.EMPLOYEE);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashBoardLayout>
      <form
        className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <EmployeeInfoSection
          errors={errors}
          detailData={detailData}
          onChange={setDetailData}
          isUpdate={location.state?.isUpdate}
          setImageFile={setImageFile}
          imageFile={imageFile}
        />
        <div className="flex flex-row gap-4 mx-auto mb-12">
          <Button
            variant="outline"
            className="w-40"
            type="button"
            onClick={() => navigate(routes.ADMIN.EMPLOYEE)}
          >
            Huy
          </Button>
          <Button className="w-40" type="submit">
            Luu
          </Button>
        </div>
      </form>
    </DashBoardLayout>
  );
}
