import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/config";
import { EmployeeInfoSection } from "@/components/employee/employee-info-section";
import { CreateEmployee, Employee, UpdateEmployee } from "@/types/user";
import { Gender } from "@/common/enums";
import userService from "@/services/user.service";

interface EmployeeNavigate {
  state: {
    data: Employee,
    isUpdate: boolean
  }
}

export default function AddEmployeeRoute() {
  const location = useLocation() as EmployeeNavigate;
  const [detailData, setDetailData] = useState<CreateEmployee | UpdateEmployee>({
    id: location.state.data.id,
    email: location.state.data.email || "",
    gender: location.state.data.gender || Gender.MALE,
    birthday: location.state.data.birthday || new Date(),
    phone: location.state.data.phone || undefined,
    fullName: location.state.data.full_name || "",
    role: "STAFF",
    password: "",
    avatar_url: location.state.data.avatar_url || "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (location.state.isUpdate)
      {
        await userService.createEmployee(detailData)
      }else{
        await userService.createEmployee(detailData)
      }
      navigate(routes.ADMIN.EMPLOYEE);
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
        <EmployeeInfoSection detailData={detailData} onChange={setDetailData} isUpdate={location.state.isUpdate}/>
        <div className="flex flex-row gap-4 mx-auto mb-12">
          <Button
            variant="outline"
            className="w-40"
            type="button"
            onClick={() => navigate(routes.ADMIN.PRODUCT)}
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
